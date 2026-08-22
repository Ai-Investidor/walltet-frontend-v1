<script setup lang="ts">
import { SocialProofPanel } from '@components/shared/social-proof-panel'
import { recommendedWallets } from '@data/wallet'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/libs/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const wallet = recommendedWallets.find((item) => item.slug === 'moderado')
if (!wallet) {
  throw new Error("src/data/wallet.ts: slug 'moderado' não encontrado em recommendedWallets")
}
</script>

<template>
  <SocialProofPanel
    :wallet="wallet"
    :class="cn('w-2/5 max-w-180 shrink-0 max-md:w-full max-md:max-w-none', props.class)"
  />
</template>
