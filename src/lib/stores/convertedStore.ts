import { writable } from 'svelte/store';

export type convertedStoreType = {
	name: string;
	type: string;
	url: string;
};

export const convertedStore = writable<convertedStoreType[]>([]);

export const setConverted = (newConverted: convertedStoreType[]) => {
	convertedStore.set(newConverted);
};
export const clearConverted = () => {
	convertedStore.set([]);
};
