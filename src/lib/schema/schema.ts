import { z } from 'zod';

export const uploadSchema = z.object({
	files: z.instanceof(File, { message: 'Please upload a file.' }).array()
});
