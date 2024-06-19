<template>
  <div class="flex flex-col gap-4">
    <div>
      <h1 class="text-xl font-semibold">Checkout</h1>
    </div>

    <!-- forms and parameters -->
    <div class="flex flex-col gap-4">
      <form class="flex flex-col gap-4">
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

        <div class="flex gap-4">
          <!-- wrapper: data parameters -->
          <div class="flex w-1/2 flex-col gap-1">
            <label :for="dataParamsID" class="text-sm font-semibold">
              Data Parameters
            </label>
            <UTextarea
              :id="dataParamsID"
              class="font-mono"
              spellcheck="false"
              placeholder="Data parameters..."
              :rows="25"
              color="purple"
              v-model="dataParameters"
            />
            <label :for="dataParamsID" class="text-xs opacity-70">
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
      </form>

      <!-- submit -->
      <div>
        <UButton
          icon="i-heroicons-paper-airplane"
          color="purple"
          label="Create Checkout"
          @click="submitData"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useAxios } from '@vueuse/integrations/useAxios'

  // states
  useUpdateTitle('Checkout')
  const privateKeyInputID = useId()
  const dataParamsID = useId()
  const privateKey = useState('privateKey', () => '')
  const dataParameters = ref('')
  const defaultParams = [
    'type=api',
    'locale=en_EN',
    'operation_type=direct_capture',
    'amount=11.30',
    'currency=EUR',
    'token_type=oneshot',
    'payment_channel=e-commerce',
    'order_merchant_id=REPLACE_ME',
  ]
  dataParameters.value = defaultParams.join('\n')
  const checkoutId = useState('checkoutId', () => '')
  const displayData = ref('')
  const displayDataInputID = useId()
  const paymentMethodsAvailable = useState('paymentMethodsAvailable', () => '')

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

      // get payment_methods_available
      if (data.value.payment_methods) {
        if (data.value.payment_methods.payment_methods_available) {
          paymentMethodsAvailable.value =
            data.value.payment_methods.payment_methods_available
        }
      } else {
        paymentMethodsAvailable.value = ''
      }

      displayData.value = JSON.stringify(data.value, undefined, 2)

      //
    } catch (error) {
      console.error(error)
    }
  }
</script>
