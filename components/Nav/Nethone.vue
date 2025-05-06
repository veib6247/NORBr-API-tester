<script lang="ts" setup>
  const nethoneLinks = [
    {
      label: 'Inquiry',
      icon: 'i-heroicons-information-circle',
      to: '/Nethone/inquiry',
    },
    {
      label: 'Transaction',
      icon: 'i-heroicons-credit-card',
      to: '/Nethone/transaction',
    },
  ]
</script>

<template>
  <div class="h-full px-8">
    <h1 class="text-xs font-semibold uppercase text-white opacity-60">
      Nethone
    </h1>
    <UVerticalNavigation :links="nethoneLinks" />
  </div>
</template>
