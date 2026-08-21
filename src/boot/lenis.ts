import Lenis from "lenis";

let lenisInstance: Lenis | undefined;

function raf(time: number): void {
	lenisInstance?.raf(time);
	requestAnimationFrame(raf);
}

export function bootLenis(): void {
	lenisInstance = new Lenis();
	requestAnimationFrame(raf);
}

export function getLenis(): Lenis {
	if (!lenisInstance) {
		throw new Error("Lenis ainda não foi inicializado — bootLenis() precisa rodar antes.");
	}
	return lenisInstance;
}
