import prisma from '$lib/prisma';
import type { UploadedFile } from '$lib/types/File';
import type { RequestHandler } from '@sveltejs/kit';
import sharp from 'sharp';
import { nanoid } from 'nanoid';

import { UTApi } from 'uploadthing/server';
export const POST: RequestHandler = async ({ request }) => {
    const utapi = new UTApi();
    try {
        const { files }: { files: UploadedFile[] } = await request.json();

        prisma.$transaction(async (tx) => {
            const newSession = await prisma.session.create({
                data: {
                    secureId: nanoid()
                }
            });
            //convert the files
            //Upon successful conversion, upload to uploadthing, and return the urls,

            const fileKeys = await Promise.all(
                files.map(async (file) => {
                    const arrayBuffer = await file.fileObject.arrayBuffer();

                    // Perform file conversion (e.g., resizing)
                    const { data, error, info } = await sharp(arrayBuffer).resize(100, 100).toBuffer();
                    if (error) {
                        throw new Error('Sharp failed to process the file');
                    } else {
                        const uploadFile = new File([data], file.name, { type: info.format });
                        const response = await utapi.uploadFiles([uploadFile]);
                    }

                    // Return a file key (or a string in your case)
                    return 'hi'; // or return a dynamic file key
                })
            );
            const newFiles = await prisma.files.createMany({
                data: fileKeys.map((fileKey) => ({
                    fileKey: fileKey, // Adjust field name as necessary
                    sessionId: newSession.id
                }))
            });
        });
        return new Response('Successful', { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('Failed', { status: 500 });
    }
};
