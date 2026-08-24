<script setup lang="ts">
import { Button } from '@components/ui/button'
import { PhArrowRight, PhShield } from '@phosphor-icons/vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="bg-background flex flex-1 items-center justify-center px-6 py-10">
    <div class="flex w-full max-w-[540px] flex-col gap-5">
      <PhShield class="size-7" aria-hidden="true" />

      <div class="flex flex-col gap-3.5">
        <h1 class="text-page-title">
          Acesso restrito
        </h1>

        <p class="text-paragraph text-muted-foreground max-w-[480px]">
          Sua conta não tem permissão para esta área. Se você precisa de acesso administrativo,
          fale com o analista responsável pela sua conta.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <Button as-child size="lg" class="rounded-sm">
          <RouterLink to="/">
            Voltar ao painel
            <PhArrowRight class="size-4" aria-hidden="true" />
          </RouterLink>
        </Button>

        <Button as-child variant="outline" size="lg" class="rounded-sm">
          <RouterLink to="/login">
            Entrar com outra conta
          </RouterLink>
        </Button>
      </div>
    </div>
  </section>
</template>
