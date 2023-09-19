import { fastify } from 'fastify';
import { prisma } from './lib/prisma';
import { getAllPropmtsRoute } from './routes/get-all-prompts';
import { uploadVideoRoute } from './routes/upload-video';

const app = fastify();

app.register(getAllPropmtsRoute);
app.register(uploadVideoRoute);

app
	.listen({
		port: 3333,
	})
	.then(() => {
		console.log('HTTP Server Running');
	});
