<template>
  <div class="flex flex-col gap-4">
    <div>
      <h1 class="text-xl font-semibold">Checkout</h1>
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
            class="w-1/2 font-mono"
            v-model="privateKey"
          />
          <label for="private_key" class="text-xs opacity-70">
            In general practice, the private key should not be exposed to the
            frontend. This is only for testing purposes
          </label>
        </div>

        <div class="flex gap-4">
          <!-- wrapper: data parameters -->
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
                href="https://developer.norbr.io/#0268ead8-a489-414e-bba8-8508c002f05f"
                target="_blank"
                class="underline"
                rel="noopener noreferrer"
              >
                here
              </a>
            </label>
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
              readonly
              v-model="displayData"
            >
            </textarea>
          </div>

          <SkeletonLoader v-else-if="isLoading" />
        </div>
      </form>

      <!-- submit -->
      <div>
        <button
          class="rounded bg-purple-950 px-4 py-2 text-white transition hover:bg-purple-900 active:scale-95"
          @click="submitData"
        >
          Create Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useAxios } from '@vueuse/integrations/useAxios'

  // states
  useUpdateTitle('Checkout')
  const privateKey = useState('privateKey', () => '')
  const dataParameters = ref('')
  const defaultParams = [
    'type=api',
    'locale=en_EN',
    'payment_method_name=visa',
    'operation_type=authorize',
    'amount=11.30',
    'currency=EUR',
    'order_merchant_id=REPLACE_ME',
    'payment_channel=e-commerce',
    'customer_email=john.wick@gmail.com',
    'customer_first_name=John',
    'customer_last_name=Wick',
    'customer_street_name=Penthouse A&D, Valero Tower 122 Valero St',
    'customer_city=Makati',
    'customer_zip_code=1227',
    'customer_country=PH',
    'customer_billing_first_name=John',
    'customer_billing_last_name=Wick',
    'customer_billing_street_name=Penthouse A&D, Valero Tower 122 Valero St',
    'customer_billing_city=Makati',
    'customer_billing_zip_code=1227',
    'customer_billing_country=PH',
  ]
  dataParameters.value = defaultParams.join('\n')
  const checkoutId = useState('checkoutId', () => '')
  const displayData = ref('')

  /**
   *
   */
  const { execute, data, isLoading } = useAxios(
    '/api/checkout',
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
          privateKey: privateKey.value,
          dataParameters: dataParameters.value,
        },
      })

      // get checkoutId, display to front
      if (data.value.checkout) {
        if (data.value.checkout.checkout_id) {
          checkoutId.value = data.value.checkout.checkout_id
        }
      } else {
        checkoutId.value = ''
      }

      displayData.value = JSON.stringify(data.value, undefined, 2)

      //
    } catch (error) {
      console.error(error)
    }
  }
</script>
