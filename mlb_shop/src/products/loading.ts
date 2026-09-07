import { DefaultLoadingManager } from "three";

const failures: string[] = [];
const waiting: (() => void)[] = [];
let loading = false;

export class ProductTextureError extends Error {
	constructor(readonly urls: readonly string[]) {
		super(`Product textures could not load: ${urls.join(", ")}`);
		this.name = "ProductTextureError";
	}
}

DefaultLoadingManager.onStart = () => {
	loading = true;
};
DefaultLoadingManager.onError = (url) => {
	failures.push(url);
};
DefaultLoadingManager.onLoad = () => {
	loading = false;
	for (const resolve of waiting.splice(0)) resolve();
};

export async function awaitProductTextures(): Promise<void> {
	if (loading) await new Promise<void>((resolve) => waiting.push(resolve));
	if (failures.length) throw new ProductTextureError([...failures]);
}
