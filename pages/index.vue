<template>
  <div class="container mx-auto flex flex-col gap-4">
    <div class="flex flex-col gap-3">
      <AppPageTitle> Welcome </AppPageTitle>

      <div class="flex flex-col gap-3">
        <p class="text-sm">
          This app contains basic test integrations for the
          <span class="font-bold">NORBr payment gateway</span> and the
          <span class="font-bold">Nethone fraud detection</span> system.
        </p>

        <UAlert
          title="Javascript files are loaded"
          color="purple"
          icon="i-heroicons-information-circle"
        >
          <template #title="{ title }">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="title" />
          </template>
          <template #description>
            The system automatically loads the required JS files for both
            systems (NORBr and Nethone) as soon as this app is loaded. In case a
            feature integration does not work, you may need to reload the page.
          </template>
        </UAlert>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  useUpdateTitle('Home')
</script>
