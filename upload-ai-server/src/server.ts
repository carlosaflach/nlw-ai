import { fastify } from 'fastify';
import { prisma } from './lib/prisma';
import { getAllPropmtsRoute } from './routes/get-all-prompts';

const app = fastify();

app.register(getAllPropmtsRoute);

app
	.listen({
		port: 3333,
	})
	.then(() => {
		console.log('HTTP Server Running');
	});
