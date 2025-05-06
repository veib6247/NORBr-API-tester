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
    <UVerticalNavigation :links="nethoneLinks" />
  </div>
</template>
