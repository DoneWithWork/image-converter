import prisma from '$lib/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import sharp from 'sharp';
import { nanoid } from 'nanoid';
import { UTApi } from 'uploadthing/server';
import type { OutputFileFormat } from '$lib/config/config';
export const POST: RequestHandler = async ({ request }) => {
	const utapi = new UTApi();
	try {
		const formData = await request.formData();

		// Get files and metadata
		const files = formData.getAll('files') as File[];
		console.log(files.map((file) => file.name));
		const metadata = JSON.parse(formData.get('metadata') as string) as Array<{
			id: string;
			outputFormat: OutputFileFormat;
		}>;

		prisma.$transaction(async (tx) => {
			const newSession = await prisma.session.create({
				data: {
					secureId: nanoid()
				}
			});
			//convert the files
			//Upon successful conversion, upload to uploadthing, and return the urls,

			const fileKeys = await Promise.all(
				files.map(async (file, index) => {
					const { outputFormat } = metadata[index];
					const arrayBuffer = await file.arrayBuffer();
					const image = sharp(arrayBuffer);

					// Get image metadata first
					const imageMetadata = await image.metadata();

					// Process image to buffer
					const data = await image.toFormat('jpeg').toBuffer();

					const blob = new Blob([data], { type: 'image/jpeg' });
					const uploadFile = new File([blob], 'test.jpeg', { type: blob.type });
					const response = await utapi.uploadFiles(uploadFile);
					if (response.error) {
						throw new Error('Uploadthing failed');
					} else {
						console.log(response.data);
						return { fileKey: response.data.key, sessionId: newSession.id }; // Return an object with fileKey and sessionId
					}
				})
			);

			// Now use the fileKeys to create files in the database
			const newFiles = await prisma.files.createMany({
				data: fileKeys.map((fileKey) => ({
					fileKey: fileKey.fileKey, // Use the correct property
					sessionId: fileKey.sessionId
				}))
			});
		});
		return new Response('Successful', { status: 200 });
	} catch (error) {
		console.error(error);
		return new Response('Failed', { status: 500 });
	}
};
