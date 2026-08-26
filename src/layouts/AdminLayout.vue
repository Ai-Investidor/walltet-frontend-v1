<script setup lang="ts">
import { AppSidebar } from '@components/shared/app-sidebar'
import { AppTopbar } from '@components/shared/app-topbar'
import { SidebarInset, SidebarProvider } from '@components/ui/sidebar'
import { adminNavigationGroups } from '@data/navigation'
import { useAuthStore } from '@stores/auth'
import { resolveRouteTitle } from '@utils/route-title'
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const pageTitle = computed(() => resolveRouteTitle(route))

async function sair() {
  await auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <SidebarProvider :default-open="true">
    <AppSidebar :groups="adminNavigationGroups" />

    <SidebarInset>
      <AppTopbar :title="pageTitle" :initials="auth.iniciais" @sair="sair" />

      <main class="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <RouterView />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
