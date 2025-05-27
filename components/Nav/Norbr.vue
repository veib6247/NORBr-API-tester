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
      label: 'Redirect (Order Retrieval)',
      icon: 'i-heroicons-arrow-uturn-left',
      to: '/NORBr/redirect?status=accept',
    },
  ]
</script>

<template>
  <div class="h-full p-4">
    <UVerticalNavigation :links="norbrLinks" />
  </div>
</template>
