<script setup lang="ts">
import { LgpdConsentModal } from '@components/shared/lgpd-consent-modal'
import { Toaster } from '@components/ui/sonner'
</script>

<template>
  <RouterView />
  <Toaster />
  <LgpdConsentModal />
</template>
