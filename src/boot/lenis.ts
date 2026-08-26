import Lenis from 'lenis'

let lenisInstance: Lenis | undefined

function raf(time: number): void {
  lenisInstance?.raf(time)
  requestAnimationFrame(raf)
}

export function bootLenis(): void {
  // allowNestedScroll: o layout autenticado (AppLayout) tem um <main> com
  // scroll próprio (overflow-y-auto) dentro da área fixa da sidebar/topbar.
  // Sem essa opção o Lenis assume que só a janela rola, intercepta o wheel/touch
  // e não repassa pro <main> interno — a página trava (nada rola) assim que o
  // conteúdo interno é mais alto que a viewport.
  lenisInstance = new Lenis({ allowNestedScroll: true })
  requestAnimationFrame(raf)
}

export function getLenis(): Lenis {
  if (!lenisInstance) {
    throw new Error('Lenis ainda não foi inicializado — bootLenis() precisa rodar antes.')
  }
  return lenisInstance
}
