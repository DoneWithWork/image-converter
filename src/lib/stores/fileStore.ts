// src/stores/files.ts
import { writable } from 'svelte/store';
import type { UploadedFile } from '../types/File';

export const filesStore = writable<UploadedFile[]>([]);

export const addFile = (newFile: UploadedFile) => {
	filesStore.update((files) => [...files, newFile]);
};

export const removeFile = (id: string) => {
	filesStore.update((files) => files.filter((file) => file.id !== id));
};

export const clearFiles = () => {
	filesStore.set([]);
};

export function handleFileInput(event: Event | FileList) {
	if (event instanceof Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			for (const file of input.files) {
				const newFile: UploadedFile = {
					id: crypto.randomUUID(),
					name: file.name,
					size: file.size,
					source: 'input',
					fileObject: file
				};
				addFile(newFile);
			}
		}
	} else {
		// Handle FileList directly
		for (const file of event) {
			const newFile: UploadedFile = {
				id: crypto.randomUUID(),
				name: file.name,
				size: file.size,
				source: 'input',
				fileObject: file
			};
			addFile(newFile);
		}
	}
}
