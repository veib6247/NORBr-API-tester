<template>
  <NuxtLink
    class="flex w-full gap-2 rounded px-4 py-2 text-white/90 transition hover:bg-purple-700"
    :to="routeTo"
  >
    <slot></slot>
  </NuxtLink>
</template>

<script lang="ts" setup>
  defineProps<{
    routeTo: string
  }>()
</script>
