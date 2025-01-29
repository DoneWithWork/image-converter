import { Award, Cloud, Image, Link, Shield } from 'lucide-svelte';

export const CTA = [
	{
		icon: Image,
		label: 'Convert Any Image',
		description: 'Convert any image to any format'
	},
	{
		icon: Shield,
		label: 'Free and Secure',
		description:
			"Our image converter is free and secure, we don't store any of your data permanently. We also don't use any third-party services to process your images."
	},
	{
		icon: Award,
		label: 'Fast and Reliable',
		description: 'Our image converter is fast and reliable, we process your images in seconds.'
	}
];

export const options = [
	{
		name: 'From Google Drive',
		icon: Cloud
	},
	{
		name: 'From URL',
		icon: Link
	}
];

export const inputFileFormats = ['jpg', 'png'] as const; // Add more formats here
export type InputFileFormat = (typeof inputFileFormats)[number];

export type OutputFileFormat = 'jpg' | 'png' | 'webp' | 'gif' | 'bmp' | 'tiff' | 'pdf';

const conversionConfig: Record<InputFileFormat, OutputFileFormat[]> = {
	jpg: ['png', 'webp'],
	png: ['jpg', 'webp']
};
export function getPossibleConversions(fileType: InputFileFormat | null): OutputFileFormat[] {
	if (!fileType) return []; // Handle null case
	return conversionConfig[fileType] || [];
}

export function isSupportedInput(filename: string): boolean {
	const fileType = filename.split('.').pop();
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
