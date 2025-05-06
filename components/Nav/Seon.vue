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
  <div class="h-full p-4">
    <UVerticalNavigation :links="seonLinks" />
  </div>
</template>
