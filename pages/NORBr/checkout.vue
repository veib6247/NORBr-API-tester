<script lang="ts" setup>
  // libs
  import { useAxios } from '@vueuse/integrations/useAxios'
  import { nanoid } from 'nanoid'

  // states
  useUpdateTitle('Checkout')
  const privateKeyInputID = useId()
  const privateKey = useState<string>('privateKey')
  const versionNumberID = useId()
  const versionNumber = useState<number>('versionNumber')

  // data parameters
  const dataParamsID = useId()
  const dataParameters = ref('')
  const defaultParams = [
    'type=api',
    'locale=en_EN',
    'operation_type=direct_capture',
    'amount=11.30',
    'currency=EUR',
    'token_type=oneshot',
    'payment_channel=e-commerce',
  ]

  // JSON Parameters
  const jsonParamsId = useId()
  const isJsonPayload = ref(true)
  const jsonParameters = ref('')
  const jsonParametersData = {
    type: 'api',
    locale: 'en_EN',
    operation_type: 'direct_capture',
    amount: 11.3,
    currency: 'EUR',
    token_type: 'oneshot',
    payment_channel: 'e-commerce',
    order_merchant_id: 'REPLACE_ME',
    cancel_url: '',
    merchant_data: [
      {
        key: 'internal_reference_1',
        type: 'string',
        value: '906530204612289666',
        is_personal_data: false,
      },
      {
        key: 'customer_rate',
        type: 'number',
        value: '3',
        is_personal_data: false,
      },
    ],
  }

  const checkoutId = useState('checkoutId', () => '')
  const displayData = ref('')
  const displayDataInputID = useId()
  const paymentMethodsAvailable = useState('paymentMethodsAvailable', () => '')
  const { execute, data, isLoading } = useAxios(
    '/api/checkout',
    {
      method: 'POST',
    },
    { immediate: false }
  )
  const storageprivateKey = useState('storageprivateKey')
  const storageOrderId = useState('storageOrderId')

  /**
   * Submit data to the API to create a checkout.
   */
  async function submitData() {
    // validate JSON string
    try {
      JSON.parse(jsonParameters.value)
    } catch (error) {
      console.error(error)
      alert('Invalid JSON string!')

      return
    }

    storageprivateKey.value = privateKey.value
    storageOrderId.value = ''

    const payload: RequestBody = {
      isJsonPayload: isJsonPayload.value,
      jsonParameters: jsonParameters.value,
      privateKey: privateKey.value,
      versionNumber: versionNumber.value,
      dataParameters: dataParameters.value,
    }

    try {
      await execute({
        data: payload,
      })

      // get checkoutId, display to front
      checkoutId.value = data.value?.checkout?.checkout_id || ''

      // get payment_methods_available
      paymentMethodsAvailable.value =
        data.value?.payment_methods?.payment_methods_available || ''

      displayData.value = JSON.stringify(data.value, undefined, 2)

      //
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * On mounted, generate a new order_merchant_id
   */
  onMounted(() => {
    const cancelUrl = `${window.location.origin}/NORBr/redirect?status=cancel`
    const orderMerchantId = nanoid()

    // update data parameters
    defaultParams.push(`order_merchant_id=${orderMerchantId}`)
    defaultParams.push(`cancel_url=${cancelUrl}`)
    dataParameters.value = defaultParams.join('\n')

    // update JSON parameters
    jsonParametersData.order_merchant_id = orderMerchantId
    jsonParametersData.cancel_url = cancelUrl
    jsonParameters.value = JSON.stringify(jsonParametersData, undefined, 2)
  })
</script>

<template>
  <div class="flex h-full">
    <div class="h-full max-h-full w-2/12">
      <NavNorbr />
    </div>

    <div class="flex w-10/12 flex-col gap-4 overflow-auto px-10 pb-20 pt-4">
      <AppPageTitle> Checkout </AppPageTitle>

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
            <UTooltip
              text="Submit - Create Checkout"
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
          <div class="flex w-1/2 flex-col gap-1">
            <label :for="versionNumberID" class="text-sm font-semibold">
              Version Number
            </label>
            <UTooltip
              text="Submit - Create Checkout"
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

          <UFormGroup label="Use JSON Payload">
            <UToggle color="purple" size="sm" v-model="isJsonPayload" />
          </UFormGroup>

          <div class="flex gap-4">
            <div class="flex w-1/2 flex-col gap-3">
              <!-- wrapper: data parameters -->
              <div class="flex flex-col gap-1">
                <label
                  :for="isJsonPayload ? jsonParamsId : dataParamsID"
                  class="text-sm font-semibold"
                >
                  {{ isJsonPayload ? 'JSON' : 'Data' }} Parameters
                </label>

                <UTooltip
                  text="Submit - Create Checkout"
                  :shortcuts="['ctrl', 'Enter']"
                  :popper="{ placement: 'top' }"
                >
                  <UTextarea
                    :id="jsonParamsId"
                    class="w-full font-mono"
                    spellcheck="false"
                    placeholder="Data parameters..."
                    :rows="25"
                    color="purple"
                    v-model="jsonParameters"
                    @keyup.ctrl.enter="submitData"
                    v-if="isJsonPayload"
                  />

                  <UTextarea
                    :id="dataParamsID"
                    class="w-full font-mono"
                    spellcheck="false"
                    placeholder="Data parameters..."
                    :rows="25"
                    color="purple"
                    v-model="dataParameters"
                    @keyup.ctrl.enter="submitData"
                    v-else
                  />
                </UTooltip>

                <label
                  :for="isJsonPayload ? jsonParamsId : dataParamsID"
                  class="text-xs opacity-70"
                >
                  The system generates a new value for the
                  <kbd class="font-bold">order_merchant_id</kbd> parameter on
                  every page load, you may replace it as needed. For a full list
                  of all the available parameters, check
                  <AppLink
                    to="https://developer.norbr.io/#0268ead8-a489-414e-bba8-8508c002f05f"
                    label="here"
                  />.
                </label>
              </div>

              <!-- submit -->
              <div>
                <UButton
                  icon="i-heroicons-paper-airplane"
                  color="purple"
                  label="Create Checkout"
                  :loading="isLoading"
                  @click="submitData"
                />
              </div>
            </div>

            <!-- wrapper: response -->
            <div class="flex w-1/2 flex-col gap-2" v-if="data && !isLoading">
              <div class="gap-1">
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

              <!-- show alert if the payment_methods_available exists in the response-->
              <UAlert
                title="'Payment Methods Available' has been detected"
                color="purple"
                icon="i-heroicons-information-circle"
                v-if="paymentMethodsAvailable.length > 0"
              >
                <template #title="{ title }">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <span v-html="title" />
                </template>
                <template #description>
                  The system will use the items found in the
                  <kbd>payment_methods_available</kbd> array as values for the
                  Hosted Elements' <kbd class="font-bold">paymentmethods</kbd>.
                </template>
              </UAlert>

              <!-- show alert if the payment_methods_available exists but is an empty array -->
              <UAlert
                title="Checkout does not have any 'Payment Methods Available'"
                color="red"
                icon="i-heroicons-exclaimation-triangle"
                v-if="
                  data.payment_methods && paymentMethodsAvailable.length < 1
                "
              >
                <template #title="{ title }">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <span v-html="title" />
                </template>
                <template #description>
                  A checkout has been created but the merchant entity does not
                  have any payment methods for the Hosted Elements to use.
                  Ensure that the <span class="font-bold">operation</span>,
                  <span class="font-bold">token type</span>, and/or
                  <span class="font-bold">currency</span> is supported for this
                  merchant.
                </template>
              </UAlert>

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
                  A redirect URL is detected,
                  <a
                    :href="data.redirect_url"
                    rel="noopener noreferrer"
                    class="underline"
                    >click here</a
                  >
                  to view the page.
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
  </div>
</template>
