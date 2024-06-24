<template>
  <div class="flex flex-col gap-4">
    <div>
      <h1 class="text-xl font-semibold">Redirect</h1>
    </div>

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
        This is a generic redirect page, you can query the order status below or
        just check the transaction details in the gateway.
      </template>
    </UAlert>

    <div class="flex gap-4">
      <!-- forms and parameters -->
      <form class="flex w-1/2 flex-col gap-2">
        <!-- wrapper: private key -->
        <div class="flex flex-col gap-1">
          <input
            type="text"
            autocomplete="username"
            name="dummy_username"
            class="hidden"
          />
          <label :for="privateKeyInputID" class="text-sm font-semibold">
            Private Key
          </label>
          <UInput
            :id="privateKeyInputID"
            icon="i-heroicons-key"
            type="password"
            color="purple"
            placeholder="Private Key"
            v-model="privateKey"
            autocomplete="new-password"
          />

          <label :for="privateKeyInputID" class="text-xs opacity-70">
            In general practice, the private key should not be exposed to the
            frontend. This is only for testing purposes
          </label>
        </div>

        <!-- wrapper: orderId -->
        <div class="flex flex-col gap-1">
          <label :for="orderIdInputID" class="text-sm font-semibold">
            Order ID
          </label>
          <UInput
            :id="orderIdInputID"
            icon="i-heroicons-identification"
            color="purple"
            placeholder="Order ID"
            v-model="orderId"
          />
        </div>

        <!-- submit -->
        <div class="mt-2">
          <UButton
            type="submit"
            icon="i-heroicons-paper-airplane"
            color="purple"
            :loading="isLoading"
            label="Get order details"
            @click="submitData"
          />
        </div>
      </form>

      <!-- wrapper: response -->
      <div class="flex w-1/2 flex-col gap-1" v-if="data">
        <label :for="displayDataInputID" class="text-sm font-semibold">
          Response Data
        </label>
        <UTextarea
          :id="displayDataInputID"
          class="font-mono"
          spellcheck="false"
          :rows="25"
          color="purple"
          v-model="displayData"
          readonly
        />
      </div>

      <div class="w-1/2 space-y-1" v-else-if="isLoading">
        <label class="text-sm font-semibold"> Loading... </label>
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-full" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  // libs
  import { useAxios } from '@vueuse/integrations/useAxios'

  // page setups
  useUpdateTitle('Redirect')

  // states
  const privateKey = useState('privateKey')
  const privateKeyInputID = useId()
  const orderId = useState('orderId')
  const orderIdInputID = useId()
  const displayData = ref('')
  const displayDataInputID = useId()

  /**
   *
   */
  const { execute, data, isLoading } = useAxios(
    '/api/orderDetail',
    {
      method: 'POST',
    },
    { immediate: false }
  )

  /**
   *
   */
  const submitData = async () => {
    data.value = ''

    try {
      await execute({
        data: {
          orderId: orderId.value,
          privateKey: privateKey.value,
        },
      })

      displayData.value = JSON.stringify(data.value, undefined, 2)

      //
    } catch (error) {
      console.error(error)
    }
  }
</script>
