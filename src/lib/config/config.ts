import type { FileFormat } from '$lib/types/File';
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

export type InputFileFormat = 'jpg' | 'png';
type OutputFileFormat = 'jpg' | 'png' | 'webp' | 'gif' | 'bmp' | 'tiff' | 'pdf';

const conversionConfig: Record<InputFileFormat, OutputFileFormat[]> = {
	jpg: ['png', 'webp'],
	png: ['jpg', 'webp'],
};

export function getPossibleConversions(fileType: InputFileFormat | null): OutputFileFormat[] {
	if (!fileType) return []; // Handle null case
	return conversionConfig[fileType] || [];
}



export function returnFileType(filename: string): InputFileFormat | null {
	console.log(filename)
	const extension = filename.split('.').pop()?.toLowerCase();
	console.log(extension)
	return (extension === 'jpg' || extension === 'png') ? extension : null;
}
