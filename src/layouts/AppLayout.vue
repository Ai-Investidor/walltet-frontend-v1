<script setup lang="ts">
import { AppSidebar } from '@components/shared/app-sidebar'
import { AppTopbar } from '@components/shared/app-topbar'
import { ProfileGauge } from '@components/shared/profile-gauge'
import { SidebarInset, SidebarProvider } from '@components/ui/sidebar'
import { navigationGroups } from '@data/navigation'
import { useAuthStore } from '@stores/auth'
import { perfilParaRotulo } from '@utils/perfil'
import { resolveRouteTitle } from '@utils/route-title'
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const pageTitle = computed(() => resolveRouteTitle(route))

const rotuloPerfil = computed(() =>
  auth.usuario?.perfilInvestidor ? perfilParaRotulo(auth.usuario.perfilInvestidor) : null,
)

async function sair() {
  await auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <SidebarProvider :default-open="true">
    <AppSidebar :groups="navigationGroups">
      <!-- Estado "sem avaliação ainda" — ver docs/AUDITORIA-INTEGRACAO.md §3.2. -->
      <template v-if="auth.nivelPerfilInvestidor && rotuloPerfil" #footer>
        <div class="flex flex-col gap-2 rounded-md border border-border bg-card p-3.5">
          <span class="text-eyebrow text-muted-foreground-faint">Seu perfil</span>
          <div class="flex items-center gap-2.5">
            <ProfileGauge
              :level="auth.nivelPerfilInvestidor"
              tone="success"
              :label="`Perfil de investidor ${rotuloPerfil.toLowerCase()}, nível ${auth.nivelPerfilInvestidor} de 4`"
            />
            <span class="text-eyebrow text-foreground">{{ rotuloPerfil }}</span>
          </div>
          <RouterLink to="/avaliacao-perfil" class="text-label w-fit text-success">
            Refazer avaliação
          </RouterLink>
        </div>
      </template>
      <template v-else #footer>
        <div class="flex flex-col gap-2 rounded-md border border-border bg-card p-3.5">
          <span class="text-eyebrow text-muted-foreground-faint">Perfil de investidor</span>
          <p class="text-label text-muted-foreground">Você ainda não fez a avaliação de perfil.</p>
          <RouterLink to="/avaliacao-perfil" class="text-label w-fit text-success">
            Fazer avaliação
          </RouterLink>
        </div>
      </template>
    </AppSidebar>

    <SidebarInset>
      <AppTopbar :title="pageTitle" :initials="auth.iniciais" @sair="sair" />

      <main class="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <RouterView />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
