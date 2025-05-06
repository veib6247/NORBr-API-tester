<template>
  <ULink :to="to" target="_blank" class="underline">
    {{ label }}
  </ULink>
</template>

<script lang="ts" setup>
  defineProps<{
    to: string
    label: string
  }>()
</script>
