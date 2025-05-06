<script lang="ts" setup>
  const links = [
    {
      label: 'NORBr API Tester',
      icon: 'i-heroicons-home',
      to: '/',
    },
    {
      label: 'NORBr API',
      icon: 'i-heroicons-command-line',
      to: '/NORBr/checkout',
    },
    {
      label: 'Nethone API',
      icon: 'i-heroicons-shield-check',
      to: '/Nethone/inquiry',
    },
    {
      label: 'SEON API',
      icon: 'i-heroicons-lock-closed',
      to: '/Seon/fraud-api',
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
