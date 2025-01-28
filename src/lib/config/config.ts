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
