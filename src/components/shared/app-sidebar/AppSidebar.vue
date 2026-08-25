<script setup lang="ts">
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
} from '@components/ui/sidebar'
import type { NavigationGroup, NavigationIcon } from '@data/navigation'
import {
  PhChartBar,
  PhChartPie,
  PhFileText,
  PhSlidersHorizontal,
  PhSquaresFour,
  PhStack,
  PhUser,
  PhUsers,
} from '@phosphor-icons/vue'
import type { Component, HTMLAttributes } from 'vue'
import { computed } from 'vue'
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
</script>

<template>
  <Sidebar collapsible="icon" :class="props.class">
    <SidebarHeader class="gap-2 px-5.5 pt-5.5 pb-4.5">
      <div class="flex items-center gap-2.25">
        <div class="flex size-6.5 items-center justify-center rounded-sm bg-foreground">
          <span class="text-eyebrow text-background">AI</span>
        </div>
        <span class="text-card-title">AI Invest</span>
      </div>
    </SidebarHeader>

    <SidebarContent class="gap-1 px-3">
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

    <SidebarFooter v-if="$slots.footer" class="px-3 pb-3">
      <slot name="footer" />
    </SidebarFooter>
  </Sidebar>
</template>
