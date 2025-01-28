// src/types/File.ts
import { Icon } from 'lucide-svelte';
export interface UploadedFile {
	id: string; // A unique identifier for the file (e.g., UUID or timestamp)
	name: string; // File name
	size: number; // File size in bytes
	source: 'dropzone' | 'input' | 'google-drive'; // Source of the file
	fileObject: File; // The actual File object
	convertFormat?: string;
}
export type optionsType = {
	name: string;
	icon: typeof Icon;
};
