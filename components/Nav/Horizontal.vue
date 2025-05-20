<script lang="ts" setup>
  const links = [
    {
      label: 'NORBr API Tester',
      icon: 'i-heroicons-home',
      to: '/',
    },
    {
      label: 'NORBr',
      icon: 'i-heroicons-command-line',
      to: '/NORBr/checkout',
    },
    {
      label: 'Nethone',
      icon: 'i-heroicons-shield-check',
      to: '/Nethone/inquiry',
    },
    {
      label: 'SEON',
      icon: 'i-heroicons-lock-closed',
      to: '/Seon/fraud-api',
    },
    {
      label: 'BIP Webhook Decryptor',
      icon: 'i-heroicons-command-line',
      to: '/Paysourcing/webhook-decryptor',
    },
  ]
</script>

<template>
  <UHorizontalNavigation
    :links="links"
    class="border-b border-gray-200 px-5 dark:border-gray-800"
    :ui="{
      active:
        'text-gray-900 dark:text-white after:bg-purple-500 dark:after:bg-purple-400 after:rounded-full',
    }"
  />
</template>
