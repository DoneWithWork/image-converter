import { inputFileFormats, type InputFileFormat, type OutputFileFormat } from '$lib/types/types';
import { Award, Image, Shield } from 'lucide-svelte';
import mime from 'mime-types';
export const CTA = [
	{
		icon: Image,
		label: 'Convert Any Image',
		description:
			'Easily convert images to your preferred format in just a few clicks—supporting JPG, PNG, TIFF, and more.'
	},
	{
		icon: Shield,
		label: 'Free & Secure',
		description:
			'Our converter is 100% free and prioritizes your privacy. All uploaded files are automatically deleted within an hour—no tracking, no data sharing.'
	},
	{
		icon: Award,
		label: 'Fast & Reliable',
		description:
			'Experience lightning-fast image conversions with high-quality output. No delays, just instant results.'
	}
];

const conversionConfig: Record<InputFileFormat, OutputFileFormat[]> = {
	jpg: ['png', 'webp'],
	png: ['jpg', 'webp', 'tiff', 'bmp'],
	webp: ['jpg', 'png', 'tiff', 'bmp'],
	jpeg: ['png', 'webp'],
	tiff: ['jpg', 'png', 'webp'],
	bmp: ['jpg', 'png', 'webp']
};
export function returnFileTypeShort(fileType: string) {
	// example image/png -> png
	return fileType.split('/')[1];
}
export function isShortInputFileTypeSupported(fileType: InputFileFormat): boolean {
	return inputFileFormats.includes(fileType as InputFileFormat);
}
export function getPossibleConversions(fileType: InputFileFormat | null): OutputFileFormat[] {
	if (!fileType) return []; // Handle null case
	return conversionConfig[fileType] || [];
}

export function isSupportedInput(type: string): boolean {
	const fileType = mime.extension(type);

	return fileType !== undefined && inputFileFormats.includes(fileType as InputFileFormat);
}
export function returnDefaultOutputFormat(inputFormat: InputFileFormat): OutputFileFormat {
	return conversionConfig[inputFormat]?.[0];
}

export function getInputFileFormat(filename: string): InputFileFormat | null {
	const fileType = filename.split('.').pop()?.toLowerCase();
	return fileType !== undefined && inputFileFormats.includes(fileType as InputFileFormat)
		? (fileType as InputFileFormat)
		: null;
}
export function returnOutputFormats(format: InputFileFormat): OutputFileFormat[] {
	return conversionConfig[format];
}
// function to remove extension from name and add new extension to end
export function changeFileExtension(name: string, newExtension: string): string {
	if (!name.includes('.')) return name + '.' + newExtension;
	const split = name.split('.');
	split.pop();
	return split.join('.') + '.' + newExtension;
}