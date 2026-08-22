import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * Text styles próprios do projeto (definidos com @utility em src/assets/index.css).
 * Precisam ser registrados no grupo `font-size` do tailwind-merge — sem isso o
 * twMerge os classifica como utilitário de COR e `cn('text-paragraph', 'text-muted-foreground')`
 * apaga a tipografia silenciosamente.
 */
const TEXT_STYLES = [
  'title',
  'heading',
  'heading-caps',
  'label',
  'paragraph',
  'paragraph-light',
  'paragraph-strong',
  'caption',
  'caption-sm',
  'button',
  'button-sm',
  'button-xs',
  'eyebrow',
  'nav-item',
  'metric',
  'metric-sm',
  'table-row',
  'table-value',
  'chart-label',
  'page-title',
  'page-title-sm',
  'section-title',
  'card-title',
  'topbar-title',
  'topbar-meta',
  'tag',
  'tag-sm',
]

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: TEXT_STYLES }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
