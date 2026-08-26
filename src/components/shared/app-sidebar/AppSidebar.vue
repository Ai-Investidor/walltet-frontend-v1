<script setup lang="ts">
import { Button } from '@components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@components/ui/sidebar'
import { Switch } from '@components/ui/switch'
import type { NavigationGroup, NavigationIcon } from '@data/navigation'
import {
  PhCalendarBlank,
  PhCaretDown,
  PhChartBar,
  PhChartPie,
  PhFileText,
  PhMoon,
  PhSlidersHorizontal,
  PhSquaresFour,
  PhStack,
  PhUser,
  PhUsers,
  PhX,
} from '@phosphor-icons/vue'
import type { Component, HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

interface Props {
  groups: NavigationGroup[]
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const ICONS: Record<NavigationIcon, Component> = {
  PhSquaresFour,
  PhChartPie,
  PhFileText,
  PhStack,
  PhUser,
  PhChartBar,
  PhUsers,
  PhSlidersHorizontal,
}

const route = useRoute()

/** Um item cobre a rota quando é o destino exato ou um ancestral do caminho atual. */
function covers(to: string) {
  return route.path === to || (to !== '/' && route.path.startsWith(`${to}/`))
}

/**
 * Só o item mais específico fica ativo: em `/admin/carteiras/x`, tanto `/admin`
 * quanto `/admin/carteiras` cobrem a rota, e o destaque pertence ao segundo.
 */
const activeTo = computed(() =>
  props.groups
    .flatMap((group) => group.items)
    .map((item) => item.to)
    .filter(covers)
    .reduce((longest, to) => (to.length > longest.length ? to : longest), ''),
)

const { isMobile, setOpenMobile } = useSidebar()
const darkModeEnabled = ref(false)
</script>

<template>
  <Sidebar collapsible="icon" :class="props.class">
    <SidebarHeader
      class="gap-2 px-5.5 pt-5.5 pb-4.5 max-md:flex-row max-md:items-center max-md:justify-between max-md:gap-0 max-md:border-b max-md:border-border max-md:px-5 max-md:py-4"
    >
      <div class="flex items-center gap-2.25">
        <div class="flex size-6.5 items-center justify-center rounded-sm bg-foreground">
          <span class="text-eyebrow text-background">AI</span>
        </div>
        <span class="text-card-title">AI Invest</span>
      </div>

      <Button
        v-if="isMobile"
        variant="outline"
        size="icon"
        class="size-9 rounded-full"
        aria-label="Fechar menu"
        @click="setOpenMobile(false)"
      >
        <PhX class="size-4.5" aria-hidden="true" />
      </Button>
    </SidebarHeader>

    <SidebarContent class="gap-1 px-3 max-md:gap-2 max-md:px-4 max-md:pt-4 max-md:pb-2">
      <Button
        v-if="isMobile && $slots.footer"
        variant="outline"
        class="h-9 w-41.5 justify-between gap-2.5 px-3.5"
      >
        <span class="flex items-center gap-2.5">
          <PhCalendarBlank class="size-4 text-muted-foreground" aria-hidden="true" />
          <span class="text-meta">Agosto 2026</span>
        </span>
        <PhCaretDown class="size-3.25 text-muted-foreground-faint" aria-hidden="true" />
      </Button>

      <nav aria-label="Navegação principal">
        <SidebarGroup v-for="group in props.groups" :key="group.label" class="gap-1.5 px-0 py-1.5">
          <SidebarGroupLabel class="text-eyebrow text-muted-foreground-faint px-3.5">
            {{ group.label }}
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in group.items" :key="item.to">
              <SidebarMenuButton
                v-if="item.available"
                as-child
                :is-active="item.to === activeTo"
                class="relative h-auto px-3.5 py-2.5 [&_svg]:size-4.5"
              >
                <RouterLink :to="item.to" class="flex items-center gap-2.75">
                  <span
                    class="absolute inset-y-1.5 left-0 w-0.5 rounded-full"
                    :class="item.to === activeTo ? 'bg-sidebar-primary' : 'bg-transparent'"
                  />
                  <component :is="ICONS[item.icon]" class="size-4.5" aria-hidden="true" />
                  <span class="text-nav-item">{{ item.label }}</span>
                </RouterLink>
              </SidebarMenuButton>
              <SidebarMenuButton
                v-else
                disabled
                aria-disabled="true"
                class="relative h-auto cursor-not-allowed px-3.5 py-2.5 opacity-50 [&_svg]:size-4.5"
              >
                <span class="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-transparent" />
                <component :is="ICONS[item.icon]" class="size-4.5" aria-hidden="true" />
                <span class="text-nav-item">{{ item.label }}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </nav>
    </SidebarContent>

    <div v-if="isMobile && $slots.footer" class="flex flex-col gap-2 border-t border-border px-4 pt-3.5 pb-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <PhMoon class="size-4 text-muted-foreground" aria-hidden="true" />
          <span class="text-label-strong">Tema escuro</span>
        </div>
        <Switch v-model:checked="darkModeEnabled" aria-label="Alternar tema escuro" />
      </div>
    </div>

    <SidebarFooter v-if="$slots.footer" class="px-3 pb-3 max-md:px-4 max-md:pt-0 max-md:pb-3.5">
      <slot name="footer" />
    </SidebarFooter>
  </Sidebar>
</template>
