<script setup lang="ts">
import { AppSidebar } from '@components/shared/app-sidebar'
import { AppTopbar } from '@components/shared/app-topbar'
import { SidebarInset, SidebarProvider } from '@components/ui/sidebar'
import { adminNavigationGroups } from '@data/navigation'
import { resolveRouteTitle } from '@utils/route-title'
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()

const pageTitle = computed(() => resolveRouteTitle(route))
</script>

<template>
  <SidebarProvider :default-open="true">
    <AppSidebar :groups="adminNavigationGroups" />

    <SidebarInset>
      <AppTopbar :title="pageTitle" initials="RD" />

      <main class="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <RouterView />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
