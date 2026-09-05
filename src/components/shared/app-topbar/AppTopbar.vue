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
import { PhCaretDown, PhMoon, PhSignOut, PhSun, PhUser, PhUserCircle } from '@phosphor-icons/vue'
import { useThemeStore } from '@stores/theme'
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { cn } from '@/libs/utils'

interface Props {
  /** Título da tela atual, exibido à esquerda da barra. */
  title: string
  /** Iniciais do usuário logado exibidas no avatar (ex.: "RD"). */
  initials: string
  /** Competência selecionada por padrão, já formatada (ex.: "Agosto 2026"). */
  competence?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  competence: 'Agosto 2026',
})

const emit = defineEmits<{ sair: [] }>()

const theme = useThemeStore()
const temaLabel = computed(() => (theme.escuro ? 'Ativar modo claro' : 'Ativar modo escuro'))
</script>

<template>
  <header
    data-slot="app-topbar"
    :class="cn('flex h-15 shrink-0 items-center gap-3 border-b border-border px-5 max-md:h-12 max-md:justify-between', props.class)"
  >
    <SidebarTrigger class="hidden max-md:flex" />

    <span class="text-topbar-title max-md:text-card-title flex-1 max-md:flex-none">{{ props.title }}</span>

    <div class="flex items-center gap-2.5 max-md:hidden">
      <Button
        variant="outline"
        size="icon"
        class="size-8.5"
        :aria-label="temaLabel"
        @click="theme.alternar()"
      >
        <PhSun v-if="theme.escuro" class="size-5 text-muted-foreground" aria-hidden="true" />
        <PhMoon v-else class="size-5 text-muted-foreground" aria-hidden="true" />
      </Button>

      <!--
      <Select v-model="competence">
        <SelectTrigger
          class="h-8.5 gap-2 border-border bg-background px-2.75 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input"
        >
          <PhCalendarBlank class="size-5 text-muted-foreground" aria-hidden="true" />
          <SelectValue class="text-meta" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem v-for="option in competenceOptions" :key="option" :value="option">
            {{ option }}
          </SelectItem>
        </SelectContent>
      </Select>
    -->

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
          <DropdownMenuItem as-child>
            <RouterLink to="/conta">
              <PhUserCircle class="size-4" aria-hidden="true" />
              Minha conta
            </RouterLink>
          </DropdownMenuItem>
          <DropdownMenuItem @select="emit('sair')">
            <PhSignOut class="size-4" aria-hidden="true" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <button
          type="button"
          class="hidden size-7 items-center justify-center max-md:flex"
          aria-label="Menu do usuário"
        >
          <PhUser class="size-5 text-muted-foreground" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem @select="theme.alternar()">
          <PhSun v-if="theme.escuro" class="size-4" aria-hidden="true" />
          <PhMoon v-else class="size-4" aria-hidden="true" />
          {{ temaLabel }}
        </DropdownMenuItem>
        <DropdownMenuItem as-child>
          <RouterLink to="/conta">
            <PhUserCircle class="size-4" aria-hidden="true" />
            Minha conta
          </RouterLink>
        </DropdownMenuItem>
        <DropdownMenuItem @select="emit('sair')">
          <PhSignOut class="size-4" aria-hidden="true" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </header>
</template>
