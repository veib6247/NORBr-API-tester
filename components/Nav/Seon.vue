<script lang="ts" setup>
  const seonLinks = [
    {
      label: 'Fraud API',
      icon: 'i-heroicons-shield-exclamation',
      to: '/Seon/fraud-api',
    },
  ]
</script>
<template>
  <div class="h-full px-8">
    <h1 class="text-xs font-semibold uppercase text-white opacity-60">SEON</h1>
    <UVerticalNavigation :links="seonLinks" />
  </div>
</template>
