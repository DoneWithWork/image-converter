// src/types/File.ts
import type { InputFileFormat } from '$lib/config/config';
import { Icon } from 'lucide-svelte';
export interface UploadedFile {
	id: string; // A unique identifier for the file (e.g., UUID or timestamp)
	name: string; // File name
	size: number; // File size in bytes
	type: InputFileFormat | null;
	source: 'dropzone' | 'input' | 'google-drive'; // Source of the file
	fileObject: File; // The actual File object
	convertFormat?: string;
}
export type optionsType = {
	name: string;
	icon: typeof Icon;
};
export type FileFormat = 'jpg' | 'png' | 'webp' | 'gif' | 'bmp' | 'tiff' | 'pdf' | 'docx' | 'txt';