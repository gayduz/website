// biome-ignore lint/complexity/noBannedTypes: required
export function debounce<T extends Function>(func: T, wait: number) {
	let h: NodeJS.Timeout;

	// biome-ignore lint/suspicious/noExplicitAny: required
	const callable = (...args: any) => {
		clearTimeout(h);
		h = setTimeout(() => func(...args), wait);
	};

	// biome-ignore lint/suspicious/noExplicitAny: required
	return <T>(<any>callable);
}
