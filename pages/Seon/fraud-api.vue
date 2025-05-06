<template>
  <div class="flex h-full">
    <div class="h-full max-h-full w-2/12">
      <NavSeon />
    </div>

    <div class="flex w-10/12 flex-col gap-4 overflow-auto px-10 pb-20 pt-4">
      <AppPageTitle> Fraud API </AppPageTitle>
      <p class="text-sm">
        SEON's proprietary API combines our email, phone number, IP, and AML
        APIs with device fingerprinting so that you can request and receive our
        enriched data, rules, and scoring in a single API call.
      </p>

      <div class="flex flex-row gap-4">
        <!-- left -->
        <div class="flex w-1/2 flex-col gap-2">
          <UFormGroup
            label="Customer Data"
            help="These are the data that a merchant would submit to SEON. Our app automatically adds the session data here."
          >
            <div class="w-full space-y-1" v-if="isTextAreaLoading">
              <label class="text-sm font-semibold"> Loading... </label>
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-full" />
            </div>

            <UTextarea
              :id="defaultParamsFormId"
              class="font-mono"
              spellcheck="false"
              :rows="25"
              color="purple"
              v-model="defaultParams"
              v-else
            />
          </UFormGroup>

          <div v-if="!isTextAreaLoading">
            <UButton
              color="purple"
              variant="solid"
              @click="submitData"
              :loading="isLoading"
            >
              Send Data
            </UButton>
          </div>
        </div>

        <!-- right -->
        <div class="flex w-1/2 flex-col gap-2">
          <div class="w-full space-y-1" v-if="isLoading">
            <label class="text-sm font-semibold"> Loading... </label>
            <USkeleton class="h-4 w-full" />
            <USkeleton class="h-4 w-full" />
            <USkeleton class="h-4 w-full" />
          </div>

          <UFormGroup label="Response Data" v-else-if="responseData">
            <UTextarea
              :id="responseDataFormId"
              class="font-mono"
              spellcheck="false"
              :rows="25"
              color="purple"
              v-model="responseData"
              readonly
            />
          </UFormGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useAxios } from '@vueuse/integrations/useAxios'

  useUpdateTitle('Fraud API')

  const isTextAreaLoading = ref(true)
  const defaultParams = ref('')
  const defaultParamsFormId = useId()
  const { execute, data, isLoading } = useAxios(
    '/api/Seon/fraud',
    {
      method: 'POST',
    },
    { immediate: false }
  )
  const responseData = ref()
  const responseDataFormId = useId()
  const requestPayload = {
    config: {
      ip: {
        include: 'flags,history,id',
        version: 'v1',
      },
      aml: {
        version: 'v1',
        monitoring_required: true,
      },
      email: {
        include: 'flags,history,id',
        version: 'v2',
      },
      phone: {
        include: 'flags,history,id',
        version: 'v1',
      },
      ip_api: true,
      email_api: true,
      phone_api: true,
      aml_api: true,
      device_fingerprinting: true,
    },
    ip: '192.168.0.1',
    action_type: 'purchase',
    transaction_id: 'payreto_test_transaction_001',
    affiliate_id: '',
    order_memo: '',
    email: 'john.doe@payreto.com',
    email_domain: 'payreto.com',
    password_hash: '',
    user_fullname: 'John Doe',
    user_firstname: 'John',
    user_middlename: 'Scooby',
    user_lastname: 'Doe',
    user_dob: '1993-05-28',
    user_pob: 'Marburg',
    user_photoid_number: 'image_001',
    user_id: '123456',
    user_name: 'john_doe',
    user_created: 1446370717,
    user_country: 'DE',
    user_city: 'Marburg',
    user_region: 'Hesse',
    user_zip: '35037',
    user_street: 'Steinweg 41',
    user_street2: '',
    session: '',
    payment_mode: 'card',
    card_fullname: 'John Doe',
    card_bin: '420000',
    card_hash: '',
    card_last: '0000',
    card_expire: '2030-12',
    avs_result: '',
    cvv_result: '',
    payment_provider: '',
    phone_number: '0642161361',
    transaction_type: 'purchase',
    transaction_amount: 1000.0,
    transaction_currency: 'EUR',
    brand_id: 'Nike',
    items: [
      {
        item_id: 'item_001',
        item_quantity: 1,
        item_name: 'Shoe',
        item_price: 1000.0,
        item_store: 'Nike',
        item_store_country: 'DE',
        item_category: 'Footware',
        item_url: 'https://nike.com/items/item_001',
        item_custom_fields: { color: 'pink' },
      },
    ],
    shipping_country: 'DE',
    shipping_city: 'Marburg',
    shipping_region: 'Hesse',
    shipping_zip: '35037',
    shipping_street: 'Steinweg 41',
    shipping_street2: '',
    shipping_phone: '0642161361',
    shipping_fullname: 'John Doe',
    shipping_method: 'standard',
    billing_country: 'DE',
    billing_city: 'Marburg',
    billing_region: 'Hesse',
    billing_zip: '35037',
    billing_street: 'Steinweg 41',
    billing_street2: '',
    billing_phone: '0642161361',
    discount_code: 'shoppee_payday_12_30',
    gift: true,
    gift_message: false,
    merchant_id: 'Dummy Merchant A',
    details_url: 'https://nike.com/items/item_001',
    custom_fields: {},
  }

  /**
   *
   */
  const submitData = async () => {
    responseData.value = ''

    try {
      const parsedPayload = JSON.parse(defaultParams.value)

      try {
        await execute({
          data: parsedPayload,
        })

        responseData.value = JSON.stringify(data.value, undefined, 2)

        //
      } catch (error) {
        console.error(error)
      }

      //
    } catch (error) {
      console.error(error)
      alert(`Invalid JSON format, please check your customer data.\n\n${error}`)
    }
  }

  /**
   *
   */
  const buildDefaultParam = (): string => {
    return JSON.stringify(requestPayload, undefined, 2)
  }

  /**
   * call SEON methods to do things...
   */
  onMounted(async () => {
    // @ts-ignore
    seon.init()

    const config = {
      geolocation: {
        canPrompt: true,
      },
      networkTimeoutMs: 2000,
      fieldTimeoutMs: 2000,
      region: 'eu',
      silentMode: false,
    }

    try {
      // @ts-ignore
      requestPayload.session = await seon.getSession(config)

      //
    } catch (error) {
      console.error(error)
    }

    defaultParams.value = buildDefaultParam()
    isTextAreaLoading.value = false
  })
</script>
