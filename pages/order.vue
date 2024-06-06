<template>
  <div class="flex flex-col gap-4">
    <div>
      <h1 class="text-xl font-semibold">Order</h1>
    </div>

    <!-- forms and parameters -->
    <div class="flex flex-col gap-4">
      <form class="flex flex-col gap-2">
        <!-- wrapper: private key -->
        <div class="flex flex-col gap-1">
          <input
            type="text"
            autocomplete="username"
            name="dummy_username"
            class="hidden"
          />
          <label for="private_key" class="text-sm font-semibold">
            Private Key
          </label>
          <input
            type="password"
            autocomplete="new-password"
            name="private_key"
            class="font-mono"
            v-model="privateKey"
          />
          <label for="private_key" class="text-xs opacity-70">
            In general practice, the private key should not be exposed to the
            frontend. This is only for testing purposes
          </label>
        </div>

        <!-- wrapper: isOrderForRecurring -->
        <div class="flex gap-2">
          <label for="displayButtons" class="my-auto text-sm font-semibold">
            Order for Recurring (Do not use, does not work yet)
          </label>
          <input
            type="checkbox"
            name="isOrderForRecurring"
            class="my-auto"
            v-model="isOrderForRecurring"
          />
        </div>

        <div class="flex gap-4">
          <!-- wrapper: data parameters and submit button -->
          <div class="flex w-1/2 flex-col gap-1">
            <label for="data_parameters" class="text-sm font-semibold">
              Data Parameters
            </label>
            <textarea
              name="data_parameters"
              rows="25"
              class="font-mono text-sm"
              spellcheck="false"
              v-model="dataParameters"
            ></textarea>
            <label for="data_parameters" class="text-xs opacity-70">
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
              <button
                class="rounded bg-purple-950 px-4 py-2 text-white hover:bg-purple-900 active:scale-95"
                @click="submitData"
              >
                Create Order
              </button>
            </div>
          </div>

          <!-- wrapper: response -->
          <div class="flex w-1/2 flex-col gap-1" v-if="data">
            <label for="data_parameters" class="text-sm font-semibold">
              Response Data
            </label>
            <textarea
              name="response_data"
              rows="25"
              class="font-mono text-sm"
              spellcheck="false"
              v-model="displayData"
              readonly
            >
            </textarea>

            <div
              class="mt-1 rounded bg-purple-100 px-4 py-2"
              v-if="data.redirect_url"
            >
              <div class="flex gap-2 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  class="my-auto size-4"
                >
                  <path
                    fill-rule="evenodd"
                    d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.75 8a.75.75 0 0 0 0 1.5h.75v1.75a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8h-1.5Z"
                    clip-rule="evenodd"
                  />
                </svg>

                3DS redirect URL detected,
                <a
                  :href="data.redirect_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="underline"
                  >click here</a
                >
                to open a new tab to the issuer's ACS page
              </div>
            </div>
          </div>

          <SkeletonLoader v-else-if="isLoading" />
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
  const dataParameters = ref('')
  const defaultParams = [
    'operation_type=direct_capture',
    'token=REPLACE_ME',
    'checkout_id=REPLACE_ME',
    'amount=11.30',
    'currency=EUR',
    'order_merchant_id=REPLACE_ME',
    'payment_channel=e-commerce',
    'accept_url=https://payreto.com',
    'decline_url=https://payreto.com',
    'pending_url=https://payreto.com',
    'exception_url=https://payreto.com',
  ]
  dataParameters.value = defaultParams.join('\n')
  const displayData = ref('')
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
</script>
