<!-- src/lib/GoogleDrivePicker.svelte -->
<script lang="ts">
	import {
		getInputFileFormat,
		isSupportedInput,
		returnDefaultOutputFormat
	} from '$lib/config/config';
	import { addFile } from '$lib/stores/fileStore';
	import { Cloud } from 'lucide-svelte';
	import { onMount } from 'svelte';

	// @ts-ignore
	let accessToken: string | null = $state(null);
	let pickerLoaded = false;
	let result = $state('');

	// Initialize Google APIs
	onMount(async () => {
		// Load Google Identity Services
		await loadScript('https://accounts.google.com/gsi/client');
		initializeTokenClient();
	});

	// @ts-ignore
	const loadScript = (src) => {
		return new Promise((resolve, reject) => {
			// @ts-ignore
			if (document.querySelector(`script[src="${src}"]`)) return resolve();
			const script = document.createElement('script');
			script.src = src;
			script.onload = resolve;
			script.onerror = reject;
			document.head.appendChild(script);
		});
	};

	const initializeTokenClient = () => {
		// @ts-ignore
		window.tokenClient = google.accounts.oauth2.initTokenClient({
			client_id: import.meta.env.VITE_PUBLIC_GOOGLE_CLIENT_ID,
			scope: 'https://www.googleapis.com/auth/drive.readonly',
			// @ts-ignore
			callback: async (response) => {
				if (response.error) {
					alert('Authentication failed: ' + response.error);
					return;
				}
				accessToken = response.access_token;
				await loadPickerApi();
				showPicker(); // Show the picker immediately after auth and API load
			}
		});
	};

	const loadPickerApi = async () => {
		if (!pickerLoaded) {
			await loadScript('https://apis.google.com/js/api.js');
			// @ts-ignore
			await new Promise((resolve) => gapi.load('picker', resolve));
			pickerLoaded = true;
		}
	};

	const handleAuth = () => {
		// @ts-ignore
		if (!accessToken) {
			// @ts-ignore
			window.tokenClient.requestAccessToken();
		} else {
			showPicker();
		}
	};

	const showPicker = () => {
		// @ts-ignore
		const view = new google.picker.View(google.picker.ViewId.DOCS);
		// @ts-ignore
		const picker = new google.picker.PickerBuilder()
			.addView(view)
			// @ts-ignore
			.setOAuthToken(accessToken)
			.setCallback(pickerCallback)
			.build();
		picker.setVisible(true);
	};

	// @ts-ignore
	const pickerCallback = (data) => {
		// @ts-ignore
		if (data.action === google.picker.Action.PICKED) {
			const docs = data.docs;
			// @ts-ignore
			docs.forEach((doc) => {
				if (!isSupportedInput(doc.mimeType)) {
					return alert(`File: ${doc.name} is unsupported`);
				} else {
					const inputFileType = getInputFileFormat(doc.name);

					addFile({
						id: doc.id,
						name: doc.name,
						size: doc.sizeBytes,
						type: doc.mimeType,
						accessToken: accessToken || '',
						driveFileId: doc.id,
						fileObject: null,
						format: inputFileType || 'jpg', // default to 'jpg' if inputFileType is null
						source: 'google-drive',
						outputFormat: returnDefaultOutputFormat(inputFileType || 'jpg')
					});
				}
			});

			// @ts-ignore
		} else if (data.action === google.picker.Action.CANCEL) {
			result = 'Picker canceled';
		}
	};
</script>

<button
	onclick={handleAuth}
	class="flex w-full flex-row items-center gap-2 border-b-[1px] border-b-gray-300 py-5 pl-3"
>
	<Cloud class="size-6 text-white" size={24} />
	<p class="cursor-pointer px-4 text-lg font-semibold text-white">From Google Drive</p>
</button>
