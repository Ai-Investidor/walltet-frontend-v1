<script setup lang="ts">
import { Avatar, AvatarFallback } from '@components/ui/avatar'
import { Button } from '@components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import { SidebarTrigger } from '@components/ui/sidebar'
import { PhCalendarBlank, PhCaretDown, PhMoon, PhSignOut } from '@phosphor-icons/vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/libs/utils'

interface Props {
  /** Título da tela atual, exibido à esquerda da barra. */
  title: string
  /** Iniciais do usuário logado exibidas no avatar (ex.: "RD"). */
  initials: string
  /** Competência selecionada, já formatada (ex.: "Agosto 2026"). */
  competence?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  competence: 'Agosto 2026',
})

const emit = defineEmits<{ sair: [] }>()
</script>

<template>
  <header
    data-slot="app-topbar"
    :class="cn('flex h-15 shrink-0 items-center gap-3 border-b border-border px-5', props.class)"
  >
    <SidebarTrigger class="hidden max-md:flex" />

    <span class="text-topbar-title flex-1">{{ props.title }}</span>

    <div class="flex items-center gap-2.5">
      <Button variant="outline" size="icon" class="size-8.5" aria-label="Alternar tema">
        <PhMoon class="size-3.75 text-muted-foreground" aria-hidden="true" />
      </Button>

      <Button variant="outline" class="h-8.5 gap-2 px-2.75">
        <PhCalendarBlank class="size-3.5 text-muted-foreground" aria-hidden="true" />
        <span class="text-meta">{{ props.competence }}</span>
        <PhCaretDown class="size-2.75 text-muted-foreground-faint" aria-hidden="true" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button type="button" class="flex items-center gap-1.75" aria-label="Menu do usuário">
            <Avatar>
              <AvatarFallback class="text-eyebrow bg-foreground text-background">
                {{ props.initials }}
              </AvatarFallback>
            </Avatar>
            <PhCaretDown class="size-2.75 text-muted-foreground-faint" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @select="emit('sair')">
            <PhSignOut class="size-4" aria-hidden="true" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>
