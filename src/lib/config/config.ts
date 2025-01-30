import { Award, Cloud, Image, Link, Shield } from 'lucide-svelte';

export const CTA = [
	{
		icon: Image,
		label: 'Convert Any Image',
		description:
			'Easily convert images to your preferred format in just a few clicks—supporting JPG, PNG, GIF, and more.'
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
