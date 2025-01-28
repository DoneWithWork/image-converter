import { createUploadthing } from 'uploadthing/server';
import type { FileRouter } from 'uploadthing/server';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	imageUploader: f(['image', 'pdf', 'text', 'audio']).onUploadComplete(
		async ({ metadata, file }) => {
			console.log('Successfully uploaded: ', file.name);
		}
	)
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
