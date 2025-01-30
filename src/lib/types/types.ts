// src/types/File.ts
import { Icon } from 'lucide-svelte';
export interface UploadedFile {
	id: string; // A unique identifier for the file (e.g., UUID or timestamp)
	name: string; // File name
	size: number;
	type: string; // MIME type of the file
	format: InputFileFormat; // store the extension part of the file
	driveFileId?: string;
	accessToken?: string;
	outputFormat: OutputFileFormat;
	source: 'dropzone' | 'input' | 'google-drive';
	fileObject: File | null;
	convertFormat?: string;
}
export type optionsType = {
	name: string;
	icon: typeof Icon;
};
export const metadata: Array<{
	id: string;
	outputFormat: OutputFileFormat;
	driveUrl: string | null;
	access_token: string | null;
}> = [];
export const inputFileFormats = ['jpg', 'png', 'jpeg', 'webp', 'tiff', 'bmp'] as const;
export type InputFileFormat = (typeof inputFileFormats)[number];

export type OutputFileFormat = 'jpg' | 'png' | 'webp' | 'gif' | 'bmp' | 'tiff';

export type Metadata = {
	id: string;
	name: string;
	outputFormat: OutputFileFormat;
	driveFileId: string | null;
	access_token: string | null;
}