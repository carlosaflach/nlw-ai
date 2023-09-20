import { FileVideo, Upload } from 'lucide-react';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react';
import { getFFmpeg } from '@/lib/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

const VideoInputForm = () => {
	const [videoFile, setVideoFile] = useState<File | null>(null);
	const promptInputRef = useRef<HTMLTextAreaElement>(null);

	const convertVideoToAudio = async (video: File) => {
		console.log('Convert Started.');

		const ffmpeg = await getFFmpeg();

		await ffmpeg.writeFile('input.mp4', await fetchFile(video));

		// ffmpeg.on('log', (log) => {
		// 	console.log(log);
		// });

		ffmpeg.on('progress', (progress) => {
			console.log('Convert progress: ' + Math.round(progress.progress * 100));
		});

		await ffmpeg.exec([
			'-i',
			'input.mp4',
			'-map',
			'0:a',
			'-b:a',
			'20k',
			'-acodec',
			'libmp3lame',
			'output.mp3',
		]);

		const data = await ffmpeg.readFile('output.mp3');

		const audioFileBlob = new Blob([data], { type: 'audio/mpeg' });
		const audioFile = new File([audioFileBlob], 'audio.mp3', {
			type: 'audio/mpeg',
		});

		console.log('Convert Finished.');

		return audioFile;
	};

	const handleUploadVideo = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const prompt = promptInputRef.current?.value;

		if (!videoFile) {
			return;
		}

		// converter o video em audio
		const audioFile = await convertVideoToAudio(videoFile);
		console.log('audioFile', audioFile);
	};

	const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
		const { files } = event.currentTarget;

		if (!files) return;

		const selectedFile = files[0];

		setVideoFile(selectedFile);
	};

	const previewUrl = useMemo(() => {
		if (!videoFile) {
			return null;
		}

		return URL.createObjectURL(videoFile);
	}, [videoFile]);

	return (
		<form className='space-y-6' onSubmit={handleUploadVideo}>
			<label
				htmlFor='video'
				className=' border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/20'>
				{previewUrl ? (
					<video
						src={previewUrl}
						controls={false}
						className='pointer-events-none'
					/>
				) : (
					<>
						<FileVideo className='w-4 h-4' />
						Selecione um video
					</>
				)}
			</label>
			<input
				type='file'
				id='video'
				accept='video/mp4'
				className='sr-only'
				onChange={handleFileSelected}
			/>

			<Separator />

			<div className='space-y-2'>
				<Label htmlFor='transcription_prompt'>Prompt de transcrição</Label>
				<Textarea
					ref={promptInputRef}
					id='transcription_prompt'
					className='h-50 leading-relaxed resize-none'
					placeholder='Inclua palavras chaves mencionadas no video separadas por virgula (,)'
				/>
			</div>

			<Button type='submit' className='w-full'>
				Carregar vídeo
				<Upload className='w-4 h-4 ml-2' />
			</Button>
		</form>
	);
};

export default VideoInputForm;
