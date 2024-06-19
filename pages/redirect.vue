<template>
  <div class="flex flex-col gap-4">
    <div>
      <h1 class="text-xl font-semibold">Redirect</h1>
    </div>

    <!-- forms and parameters -->
    <UAlert
      title="Heads up!"
      color="purple"
      icon="i-heroicons-information-circle"
    >
      <template #title="{ title }">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="title" />
      </template>

      <template #description>
        This is just a generic redirect page, please refer back to the gateway
        for the actual transaction results.
      </template>
    </UAlert>
  </div>
</template>
