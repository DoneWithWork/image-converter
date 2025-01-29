// src/stores/files.ts
import { writable } from 'svelte/store';
import type { UploadedFile } from '../types/File';
import {
	getInputFileFormat,
	isSupportedInput,
	returnDefaultOutputFormat,
	type InputFileFormat,
	type OutputFileFormat
} from '$lib/config/config';

export const filesStore = writable<UploadedFile[]>([]);

export const addFile = (newFile: UploadedFile) => {
	filesStore.update((files) => [...files, newFile]);
};
export const updateOutputFormat = (id: string, outputFormat: OutputFileFormat) => {
	filesStore.update((files) =>
		files.map((file) => (file.id === id ? { ...file, outputFormat } : file))
	);
	console.log('Changed file format');
};

export const removeFile = (id: string) => {
	filesStore.update((files) => files.filter((file) => file.id !== id));
};

export const clearFiles = () => {
	filesStore.set([]);
};

export function handleFileInput(event: Event | FileList) {
	const files = event instanceof Event ? (event.target as HTMLInputElement).files : event;

	if (!files) return;

	for (const file of files) {
		if (!isSupportedInput(file.name)) {
			return alert(`File: ${file.name} is unsupported`);
		} else {
			// Impossible for file type to be null as have already checked for non-null
			const inputFileType = getInputFileFormat(file.name) as InputFileFormat;

			addFile({
				id: crypto.randomUUID(),
				name: file.name,
				type: file.type,
				format: inputFileType,
				outputFormat: returnDefaultOutputFormat(inputFileType),
				size: file.size,
				source: 'input',
				fileObject: file
			});
		}
	}
}
