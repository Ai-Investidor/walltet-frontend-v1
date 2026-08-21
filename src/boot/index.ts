import type { App } from "vue";
import { bootLenis } from "./lenis";

const boots: Array<(app: App) => void> = [bootLenis];

export function registerBoots(app: App): void {
	for (const boot of boots) {
		boot(app);
	}
}
