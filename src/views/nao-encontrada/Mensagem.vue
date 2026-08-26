<script setup lang="ts">
import { Button } from '@components/ui/button'
import { PhArrowRight, PhTray } from '@phosphor-icons/vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="bg-background flex flex-1 items-center justify-center px-6 py-10">
    <div class="flex w-full max-w-[540px] flex-col gap-5">
      <PhTray class="size-7" aria-hidden="true" />

      <div class="flex flex-col gap-3.5">
        <h1 class="text-page-title">
          Página não encontrada
        </h1>

        <p class="text-paragraph text-muted-foreground max-w-[480px]">
          O endereço acessado não existe ou foi movido. Volte ao painel para continuar de onde parou.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <Button as-child size="lg" class="rounded-sm">
          <RouterLink to="/">
            Ir para o painel
            <PhArrowRight class="size-4" aria-hidden="true" />
          </RouterLink>
        </Button>
        <!--
        <Button as-child variant="outline" size="lg" class="rounded-sm">
          <RouterLink to="/login">
            Entrar com outra conta
          </RouterLink>
        </Button>
        -->
      </div>
    </div>
  </section>
</template>
