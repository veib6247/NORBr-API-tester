<template>
  <div class="flex flex-col gap-4">
    <div>
      <h1 class="text-xl font-semibold">Order</h1>
    </div>

    <!-- forms and parameters -->
    <div class="flex flex-col gap-4">
      <form class="flex flex-col gap-2">
        <!-- wrapper: private key -->
        <div class="flex w-1/2 flex-col gap-1">
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

        <!-- wrapper: isOrderForRecurring -->
        <UCheckbox
          color="purple"
          name="isOrderForRecurring"
          label="Order for Recurring (DO NOT USE, does not work yet)"
          v-model="isOrderForRecurring"
        />

        <div class="flex gap-4">
          <!-- wrapper: data parameters and submit button -->
          <div class="flex w-1/2 flex-col gap-1">
            <label :for="dataParametersInputID" class="text-sm font-semibold">
              Data Parameters
            </label>
            <UTextarea
              :id="dataParametersInputID"
              class="font-mono"
              spellcheck="false"
              :rows="25"
              color="purple"
              v-model="dataParameters"
            />
            <label :for="dataParametersInputID" class="text-xs opacity-70">
              For a full list of parameters, check
              <a
                href="https://developer.norbr.io/#08bfab4b-45a8-4734-87d8-b46df76eb4f8"
                target="_blank"
                class="underline"
                rel="noopener noreferrer"
              >
                here
              </a>
            </label>

            <!-- submit -->
            <div class="mt-2">
              <UButton
                icon="i-heroicons-paper-airplane"
                color="purple"
                label="Submit Order"
                @click="submitData"
              />
            </div>
          </div>

          <!-- wrapper: response -->
          <div class="flex w-1/2 flex-col gap-2" v-if="data">
            <div>
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

            <!-- show alert if 3ds url is returned from the response -->
            <UAlert
              title="Heads up!"
              color="purple"
              icon="i-heroicons-information-circle"
              v-if="data.redirect_url"
            >
              <template #title="{ title }">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="title" />
              </template>

              <template #description>
                3DS redirect URL detected,
                <a
                  :href="data.redirect_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="underline"
                  >click here</a
                >
                to open a new tab to the issuer's ACS page
              </template>
            </UAlert>
          </div>

          <div class="w-1/2 space-y-1" v-else-if="isLoading">
            <label class="text-sm font-semibold"> Loading... </label>
            <USkeleton class="h-4 w-full" />
            <USkeleton class="h-4 w-full" />
            <USkeleton class="h-4 w-full" />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useAxios } from '@vueuse/integrations/useAxios'

  // page setups
  useUpdateTitle('Order')

  // states
  const privateKey = useState('privateKey')
  const privateKeyInputID = useId()
  const dataParameters = ref('')
  const dataParametersInputID = useId()
  const defaultParams = ref([
    'operation_type=direct_capture',
    'token=REPLACE_ME',
    'checkout_id=REPLACE_ME',
  ])
  const displayData = ref('')
  const displayDataInputID = useId()
  const isOrderForRecurring = ref(false)
  const orderId = useState('orderId', () => '')

  /**
   *
   */
  const { execute, data, isLoading } = useAxios(
    '/api/order',
    {
      method: 'POST',
    },
    { immediate: false }
  )

  /**
   *
   */
  const submitData = async (event: Event) => {
    event.preventDefault()

    data.value = ''

    try {
      await execute({
        data: {
          isOrderForRecurring: isOrderForRecurring.value,
          privateKey: privateKey.value,
          dataParameters: dataParameters.value,
        },
      })

      if (data.value.order_id) {
        orderId.value = data.value.order_id
      } else {
        orderId.value = ''
      }

      displayData.value = JSON.stringify(data.value, undefined, 2)

      //
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * fetches windows location on mount to set the right redirect URLs
   */
  onMounted(() => {
    const urls = [
      `accept_url=${window.location.origin}/redirect`,
      `decline_url=${window.location.origin}/redirect`,
      `pending_url=${window.location.origin}/redirect`,
      `exception_url=${window.location.origin}/redirect`,
    ]

    defaultParams.value = [...defaultParams.value, ...urls]
    dataParameters.value = defaultParams.value.join('\n')
  })
</script>
