// src/stores/files.ts
import {
	getInputFileFormat,
	isSupportedInput,
	returnDefaultOutputFormat
} from '$lib/config/config';
import { writable } from 'svelte/store';
import type { InputFileFormat, OutputFileFormat, UploadedFile } from '../types/types';

export const filesStore = writable<UploadedFile[]>([]);

export const addFile = (newFile: UploadedFile) => {
	filesStore.update((files) => [...files, newFile]);
};
export const updateOutputFormat = (id: string, outputFormat: OutputFileFormat) => {
	filesStore.update((files) =>
		files.map((file) => (file.id === id ? { ...file, outputFormat } : file))
	);

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

		// Ensure type is supported by us
		if (!isSupportedInput(file.type)) {
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
