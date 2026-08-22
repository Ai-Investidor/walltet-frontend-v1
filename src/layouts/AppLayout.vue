<script setup lang="ts">
import { ProfileGauge } from '@components/shared/profile-gauge'
import { Avatar, AvatarFallback } from '@components/ui/avatar'
import { Button } from '@components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@components/ui/sidebar'
import type { NavigationIcon } from '@data/navigation'
import { navigationGroups } from '@data/navigation'
import {
  PhCalendarBlank,
  PhCaretDown,
  PhChartPie,
  PhFileText,
  PhMoon,
  PhSquaresFour,
  PhStack,
  PhUser,
} from '@phosphor-icons/vue'
import type { Component } from 'vue'
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

const ICONS: Record<NavigationIcon, Component> = {
  PhSquaresFour,
  PhChartPie,
  PhFileText,
  PhStack,
  PhUser,
}

const route = useRoute()
const isActive = (to: string) => route.path === to

const pageTitle = computed(() => route.meta.title ?? '')
</script>

<template>
  <SidebarProvider :default-open="true">
    <Sidebar collapsible="icon">
      <SidebarHeader class="gap-2 px-3.5 pt-4 pb-3">
        <div class="flex items-center gap-2.5">
          <div class="flex size-6.5 items-center justify-center rounded-sm bg-foreground">
            <span class="text-eyebrow text-background">AI</span>
          </div>
          <span class="text-card-title">AI Invest</span>
        </div>
      </SidebarHeader>

      <SidebarContent class="gap-1 px-3">
        <nav aria-label="Navegação principal">
          <SidebarGroup v-for="group in navigationGroups" :key="group.label" class="gap-1.5 py-1.5">
            <SidebarGroupLabel class="text-eyebrow text-muted-foreground-faint px-3.5">
              {{ group.label }}
            </SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem v-for="item in group.items" :key="item.to">
                <SidebarMenuButton
                  v-if="item.available"
                  as-child
                  :is-active="isActive(item.to)"
                  class="relative h-auto py-2.5"
                >
                  <RouterLink :to="item.to" class="flex items-center gap-2.5">
                    <span
                      class="absolute inset-y-1.5 left-0 w-0.5 rounded-full"
                      :class="isActive(item.to) ? 'bg-sidebar-primary' : 'bg-transparent'"
                    />
                    <component :is="ICONS[item.icon]" class="size-4.5" aria-hidden="true" />
                    <span class="text-nav-item">{{ item.label }}</span>
                  </RouterLink>
                </SidebarMenuButton>
                <SidebarMenuButton
                  v-else
                  disabled
                  aria-disabled="true"
                  class="relative h-auto cursor-not-allowed py-2.5 opacity-50"
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

      <SidebarFooter class="px-3 pb-3">
        <div class="flex flex-col gap-2 rounded-md border border-border bg-card p-3.5">
          <span class="text-eyebrow text-muted-foreground-faint">Seu perfil</span>
          <div class="flex items-center gap-2.5">
            <ProfileGauge :level="2" tone="success" label="Perfil de investidor moderado, nível 2 de 4" />
            <span class="text-eyebrow text-foreground">Moderado</span>
          </div>
          <button type="button" class="text-label w-fit text-success">
            Refazer avaliação
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>

    <SidebarInset>
      <header class="flex h-15 shrink-0 items-center gap-3 border-b border-border px-5">
        <SidebarTrigger class="hidden max-md:flex" />

        <span class="text-topbar-title flex-1">{{ pageTitle }}</span>

        <div class="flex items-center gap-2.5">
          <Button variant="outline" size="icon" aria-label="Alternar tema">
            <PhMoon class="size-4" aria-hidden="true" />
          </Button>

          <Button variant="outline" class="gap-2">
            <PhCalendarBlank class="size-3.5" aria-hidden="true" />
            <span class="text-topbar-meta">Agosto 2026</span>
            <PhCaretDown class="size-3" aria-hidden="true" />
          </Button>

          <button type="button" class="flex items-center gap-1.5" aria-label="Menu do usuário">
            <Avatar size="sm">
              <AvatarFallback class="text-eyebrow">AS</AvatarFallback>
            </Avatar>
            <PhCaretDown class="size-3 text-muted-foreground-faint" aria-hidden="true" />
          </button>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto">
        <RouterView />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
