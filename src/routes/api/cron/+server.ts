import prisma from '$lib/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import { UTApi } from 'uploadthing/server';

export const GET: RequestHandler = async () => {
	const utapi = new UTApi();
	const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

	try {
		// Fetch sessions and fileKeys
		const sessions = await prisma.session.findMany({
			where: {
				createdAt: {
					lt: oneHourAgo
				}
			},
			select: {
				files: true
			}
		});

		const fileKeys = sessions.flatMap((session) => session.files.map((file) => file.fileKey));

		await prisma.$transaction(async () => {
			// Delete the sessions
			await prisma.session.deleteMany({
				where: {
					createdAt: {
						lt: oneHourAgo
					}
				}
			});

			// Now delete the files on Uploadthing, if the deletion of files fails, we manually throw an error to trigger a rollback
			if (fileKeys.length > 0) {
				try {
					await utapi.deleteFiles(fileKeys);
				} catch (error) {
					console.log(error);
					throw new Error('Uploadthing failed to delete files');
				}
			}
		});

		return new Response('Success');
	} catch (error) {
		console.error(error);
		return new Response('Failed', { status: 500 });
	}
};
