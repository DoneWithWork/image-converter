import prisma from '$lib/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import sharp from 'sharp';
import { UTApi } from 'uploadthing/server';
import mime from 'mime-types';
import type { Metadata } from '$lib/types/types';
import { google } from 'googleapis';
import { changeFileExtension } from '$lib/config/config';
export const POST: RequestHandler = async ({ request }) => {
	const utapi = new UTApi();
	try {
		const formData = await request.formData();

		// Get files and metadata
		const files = formData.getAll('files') as File[];
		console.log(files.map((file) => file.name));
		const metadata = JSON.parse(formData.get('metadata') as string) as Metadata[];

		const responseData = await prisma.$transaction(async (tx) => {
			const newSession = await prisma.session.create({
				data: { secureId: nanoid() }
			});

			// Convert the files
			const fileData = await Promise.all(
				files.map(async (file, index) => {

					// Check first if the file input and output format are accepted

					const { outputFormat, driveFileId, access_token, name } = metadata[index];
					let arrayBuffer: Buffer;

					if (driveFileId && access_token) {
						const drive = google.drive({
							version: 'v3',
							headers: { Authorization: `Bearer ${access_token}` }
						});
						const driveResponse = await drive.files.get(
							{ fileId: driveFileId, alt: 'media' },
							{ responseType: 'stream' }
						);

						// Convert stream to buffer
						arrayBuffer = await new Promise<Buffer>((resolve, reject) => {
							const chunks: Buffer[] = [];
							driveResponse.data.on('data', (chunk) => chunks.push(chunk));
							driveResponse.data.on('end', () => resolve(Buffer.concat(chunks)));
							driveResponse.data.on('error', reject);
						});
					} else {
						arrayBuffer = Buffer.from(await file.arrayBuffer());
					}

					const image = sharp(arrayBuffer);
					console.log(typeof outputFormat as keyof sharp.FormatEnum);
					const data = await image.toFormat(outputFormat as keyof sharp.FormatEnum).toBuffer();

					// Create a new file blob

					const mimeType = mime.lookup(outputFormat)
					if (!mimeType) { throw new Error('Invalid output format') }
					const blob = new Blob([data], { type: mimeType });

					const uploadFile = new File([blob], changeFileExtension(file.name ?? name, outputFormat), { type: blob.type });

					// Upload to UploadThing
					const response = await utapi.uploadFiles(uploadFile);
					if (response.error) {
						throw new Error('Uploadthing failed');
					}
					return {
						name: changeFileExtension(file.name ?? name, outputFormat),
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

			return fileData.map(({ name, type, url }) => ({ name, type, url }));
		});

		return new Response(JSON.stringify({ files: responseData }), { status: 200 });
	} catch (error) {
		console.error(error);
		return new Response('Failed', { status: 500 });
	}
};
