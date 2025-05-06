<script lang="ts" setup>
  const norbrLinks = [
    {
      label: 'Checkout',
      icon: 'i-heroicons-shopping-cart',
      to: '/NORBr/checkout',
    },
    {
      label: 'Hosted Elements',
      icon: 'i-heroicons-document',
      to: '/NORBr/hostedelements',
    },
    {
      label: 'Order',
      icon: 'i-heroicons-banknotes',
      to: '/NORBr/order',
    },
    {
      label: 'Maintenance',
      icon: 'i-heroicons-code-bracket-square',
      to: '/NORBr/maintenance',
    },
    {
      label: 'Redirect',
      icon: 'i-heroicons-arrow-uturn-left',
      to: '/NORBr/redirect?status=accept',
    },
  ]
</script>

<template>
  <div class="h-full px-8">
    <h1 class="text-xs font-semibold uppercase text-white opacity-60">NORBr</h1>
    <UVerticalNavigation :links="norbrLinks" />
  </div>
</template>
