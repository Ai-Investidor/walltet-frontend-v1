import type { App, Directive } from 'vue'

const RIPPLE_FALLBACK_MS = 1000

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function onPointerDown(event: PointerEvent): void {
  if (prefersReducedMotion()) return

  const el = event.currentTarget as HTMLElement
  if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') return

  const rect = el.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)

  const span = document.createElement('span')
  span.className = 'ripple-span'
  span.style.width = `${size}px`
  span.style.height = `${size}px`
  span.style.left = `${event.clientX - rect.left - size / 2}px`
  span.style.top = `${event.clientY - rect.top - size / 2}px`

  el.appendChild(span)
  span.addEventListener('animationend', () => span.remove())
  window.setTimeout(() => span.remove(), RIPPLE_FALLBACK_MS)
}

const rippleDirective: Directive<HTMLElement> = {
  mounted(el) {
    el.classList.add('ripple-host')
    el.addEventListener('pointerdown', onPointerDown)
  },
  unmounted(el) {
    el.removeEventListener('pointerdown', onPointerDown)
  },
}

export function bootRipple(app: App): void {
  app.directive('ripple', rippleDirective)
}
