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

		const responseData = await prisma.$transaction(async (tx) => {
			const newSession = await prisma.session.create({
				data: { secureId: nanoid() }
			});

			// Convert the files
			const fileData = await Promise.all(
				files.map(async (file, index) => {
					const { outputFormat } = metadata[index];
					const arrayBuffer = await file.arrayBuffer();
					const image = sharp(arrayBuffer);

					// Convert image format
					const data = await image.toFormat('jpeg').toBuffer();

					// Create a new file blob
					const blob = new Blob([data], { type: 'image/jpeg' });
					const uploadFile = new File([blob], file.name, { type: blob.type });

					// Upload to UploadThing
					const response = await utapi.uploadFiles(uploadFile);
					if (response.error) {
						throw new Error('Uploadthing failed');
					}

					return {
						name: file.name,
						type: blob.type,
						url: response.data.url,
						fileKey: response.data.key,
						sessionId: newSession.id
					};
				})
			);

			// Store in DB
			await prisma.files.createMany({
				data: fileData.map(({ fileKey, sessionId }) => ({
					fileKey,
					sessionId
				}))
			});

			console.log(fileData);
			// Return list of files
			return fileData.map(({ name, type, url }) => ({ name, type, url }));
		});

		return new Response(JSON.stringify({ files: responseData }), { status: 200 });
	} catch (error) {
		console.error(error);
		return new Response('Failed', { status: 500 });
	}
};
