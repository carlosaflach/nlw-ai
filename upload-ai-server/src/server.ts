import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import { prisma } from './lib/prisma';
import { getAllPropmtsRoute } from './routes/get-all-prompts';
import { uploadVideoRoute } from './routes/upload-video';
import { createTranscriptionRoute } from './routes/create-transcription';
import { generateAICompletionRoute } from './routes/generate-ai-completion';

const app = fastify();
app.register(fastifyCors, {
	origin: '*',
});

app.register(getAllPropmtsRoute);
app.register(uploadVideoRoute);
app.register(createTranscriptionRoute);
app.register(generateAICompletionRoute);

app
	.listen({
		port: 3333,
	})
	.then(() => {
		console.log('HTTP Server Running');
	});
