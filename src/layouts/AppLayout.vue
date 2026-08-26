<script setup lang="ts">
import { AppSidebar } from '@components/shared/app-sidebar'
import { AppTopbar } from '@components/shared/app-topbar'
import { ProfileGauge } from '@components/shared/profile-gauge'
import { SidebarInset, SidebarProvider } from '@components/ui/sidebar'
import { navigationGroups } from '@data/navigation'
import { resolveRouteTitle } from '@utils/route-title'
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()

const pageTitle = computed(() => resolveRouteTitle(route))
</script>

<template>
  <SidebarProvider :default-open="true">
    <AppSidebar :groups="navigationGroups">
      <template #footer>
        <div class="flex flex-col gap-2 rounded-md border border-border bg-card p-3.5 max-md:rounded-lg">
          <span class="text-eyebrow text-muted-foreground-faint">Seu perfil</span>
          <div class="flex items-center gap-2.5">
            <ProfileGauge :level="2" tone="success" label="Perfil de investidor moderado, nível 2 de 4" />
            <span class="text-eyebrow text-foreground">Moderado</span>
          </div>
          <button type="button" class="text-label w-fit text-success">
            Refazer avaliação
          </button>
        </div>
      </template>
    </AppSidebar>

    <SidebarInset>
      <AppTopbar :title="pageTitle" initials="AS" />

      <main class="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <RouterView />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
