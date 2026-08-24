<script setup lang="ts">
import { Button } from '@components/ui/button'
import { PhCheckCircle } from '@phosphor-icons/vue'
import { RouterLink } from 'vue-router'

// Mock: sem reenvio real nesta fase. Quando a camada de dados dinâmica existir, este handler
// dispara o reenvio do link de redefinição para o e-mail informado em `/recuperar-senha`.
function reenviarLink() {}
</script>

<template>
  <section
    aria-labelledby="link-enviado-titulo"
    class="flex w-full flex-col items-center gap-6.5 px-6 py-10 max-sm:px-4"
  >
    <div class="flex items-center gap-2.5">
      <div class="bg-foreground flex size-6.5 items-center justify-center rounded-sm">
        <span class="text-eyebrow text-background" aria-hidden="true">AI</span>
      </div>
      <span class="text-card-title">AI Invest</span>
    </div>

    <div class="bg-card border-border flex w-full max-w-105 flex-col gap-5 rounded-lg border px-6 py-6.5">
      <PhCheckCircle class="text-success size-6.5" aria-hidden="true" />

      <header class="flex flex-col gap-2">
        <h1 id="link-enviado-titulo" class="text-page-title-sm">
          Link enviado
        </h1>
        <p class="text-table-row text-muted-foreground">
          Se existir uma conta com ana.silva@email.com, o link de redefinição chega em alguns
          minutos. Ele expira em 30 minutos e só pode ser usado uma vez.
        </p>
      </header>

      <div class="border-border flex flex-col gap-4 border-t pt-5">
        <Button as-child class="text-table-value h-11 w-full rounded-sm">
          <RouterLink to="/login">
            Voltar para entrar
          </RouterLink>
        </Button>

        <button
          type="button"
          class="text-table-row text-primary self-start hover:underline"
          @click="reenviarLink"
        >
          Enviar de novo
        </button>
      </div>
    </div>

    <p class="text-label text-muted-foreground-faint max-w-105 text-center">
      AI Invest · carteiras recomendadas revisadas mensalmente por analistas. Suporte:
      suporte@aiinvest.com.br
    </p>
  </section>
</template>
