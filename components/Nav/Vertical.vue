<template>
  <div class="flex flex-col gap-8 p-6">
    <div class="space-y-2">
      <h1 class="text-xs font-semibold uppercase text-white opacity-60">App</h1>
      <UVerticalNavigation
        :links="generalLinks"
        :ui="{
          inactive: 'text-white/80',
        }"
      />
    </div>

    <div class="space-y-2">
      <h1 class="text-xs font-semibold uppercase text-white opacity-60">
        NORBr
      </h1>
      <UVerticalNavigation
        :links="norbrLinks"
        :ui="{
          inactive: 'text-white/80',
        }"
      />
    </div>

    <div class="space-y-2">
      <h1 class="text-xs font-semibold uppercase text-white opacity-60">
        Nethone
      </h1>
      <UVerticalNavigation
        :links="nethoneLinks"
        :ui="{
          inactive: 'text-white/80',
        }"
      />
    </div>

    <div class="space-y-2">
      <h1 class="text-xs font-semibold uppercase text-white opacity-60">
        SEON
      </h1>
      <UVerticalNavigation
        :links="seonLinks"
        :ui="{
          inactive: 'text-white/80',
        }"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  const generalLinks = [
    {
      label: 'Home',
      icon: 'i-heroicons-home',
      to: '/',
    },
  ]

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

  const seonLinks = [
    {
      label: 'Fraud API',
      icon: 'i-heroicons-shield-exclamation',
      to: '/Seon/fraud-api',
    },
  ]
</script>
