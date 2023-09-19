import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';

export async function getAllPropmtsRoute(app: FastifyInstance) {
	app.get('/prompts', async () => {
		const prompts = await prisma.propmt.findMany();
		return prompts;
	});
}