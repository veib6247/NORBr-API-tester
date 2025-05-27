<script lang="ts" setup>
  // libs
  import { useAxios } from '@vueuse/integrations/useAxios'

  // page setups
  useUpdateTitle('Redirect (Order Retrieval)')

  // states
  const privateKey = useState<string>('privateKey')
  const privateKeyInputID = useId()
  const versionNumberID = useId()
  const versionNumber = useState<number>('versionNumber')
  const storageprivateKey = useState('storageprivateKey')
  const storageOrderId = useState<string>('storageOrderId')
  const orderIdInputID = useId()
  const displayData = ref('')
  const displayDataInputID = useId()
  const { execute, data, isLoading } = useAxios(
    '/api/orderDetail',
    {
      method: 'POST',
    },
    { immediate: false }
  )
  const route = useRoute()
  const status = route.query.status

  const alertTitle = computed(() => {
    switch (status) {
      case 'accept':
        return 'Transaction Accepted!'

      case 'decline':
        return 'Transaction Declined!'

      case 'pending':
        return 'Transaction Is Pending.'

      case 'exception':
        return 'An Exception Occurred!'

      default:
        return 'Unknown Status'
    }
  })

  const alertColor = computed(() => {
    switch (status) {
      case 'accept':
        return 'purple'

      case 'decline':
        return 'red'

      case 'pending':
        return 'yellow'

      case 'exception':
        return 'orange'

      default:
        return 'red'
    }
  })

  /**
   *
   */
  const submitData = async () => {
    storageprivateKey.value = privateKey.value
    data.value = ''

    try {
      await execute({
        data: {
          orderId: storageOrderId.value,
          privateKey: privateKey.value,
          versionNumber: versionNumber.value,
        },
      })

      displayData.value = JSON.stringify(data.value, undefined, 2)

      //
    } catch (error) {
      console.error(error)
    }
  }
</script>

<template>
  <div class="flex h-full">
    <div class="h-full max-h-full w-2/12">
      <NavNorbr />
    </div>

    <div class="flex w-10/12 flex-col gap-4 overflow-auto px-10 pb-20 pt-4">
      <div>
        <h1 class="text-xl font-semibold">
          Redirected with
          <span class="font-bold">{{ status }}</span> status
        </h1>
      </div>

      <UAlert
        :title="alertTitle"
        :color="alertColor"
        icon="i-heroicons-information-circle"
      >
        <template #title="{ title }">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="title" />
        </template>

        <template #description>
          <p>
            This is a generic redirect page. You may use the Order Details API
            below to fetch the final details about the transaction.
          </p>
        </template>
      </UAlert>

      <div class="flex gap-4">
        <!-- forms and parameters -->
        <form class="flex w-1/2 flex-col gap-2">
          <AppPageTitle> Order Details API </AppPageTitle>
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
            <UTooltip
              text="Submit - Get order details"
              :shortcuts="['ctrl', 'Enter']"
              :popper="{ placement: 'top' }"
            >
              <UInput
                :id="privateKeyInputID"
                class="w-full"
                icon="i-heroicons-key"
                type="password"
                color="purple"
                placeholder="Private Key"
                v-model="privateKey"
                autocomplete="new-password"
                @keyup.ctrl.enter="submitData"
              />
            </UTooltip>

            <label :for="privateKeyInputID" class="text-xs opacity-70">
              In general practice, the private key should not be exposed to the
              frontend. This is only for testing purposes
            </label>
          </div>

          <!-- wrapper: version number -->
          <div class="flex flex-col gap-1">
            <label :for="versionNumberID" class="text-sm font-semibold">
              Version Number
            </label>
            <UTooltip
              text="Submit - Get order details"
              :shortcuts="['ctrl', 'Enter']"
              :popper="{ placement: 'top' }"
            >
              <UInput
                :id="versionNumberID"
                class="w-full"
                icon="i-heroicons-hashtag"
                type="number"
                color="purple"
                placeholder="1.9"
                v-model="versionNumber"
                autocomplete="one-time-code"
                @keyup.ctrl.enter="submitData"
              />
            </UTooltip>
          </div>

          <!-- wrapper: orderId -->
          <div class="flex flex-col gap-1">
            <label :for="orderIdInputID" class="text-sm font-semibold">
              Order ID
            </label>
            <UTooltip
              text="Submit - Get order details"
              :shortcuts="['ctrl', 'Enter']"
              :popper="{ placement: 'top' }"
            >
              <UInput
                :id="orderIdInputID"
                class="w-full"
                icon="i-heroicons-identification"
                color="purple"
                placeholder="Order ID"
                v-model="storageOrderId"
                @keyup.ctrl.enter="submitData"
              />
            </UTooltip>
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
  </div>
</template>
