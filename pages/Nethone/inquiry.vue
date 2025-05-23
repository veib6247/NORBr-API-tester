<template>
  <div class="flex h-full">
    <div class="h-full max-h-full w-2/12">
      <NavNethone />
    </div>

    <div class="flex w-10/12 flex-col gap-4 overflow-auto px-10 pb-20 pt-4">
      <AppPageTitle> Inquiry </AppPageTitle>

      <div>
        <UAlert
          title="There is a dummy form below"
          color="red"
          icon="i-heroicons-exclaimation-triangle"
        >
          <template #title="{ title }">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="title" />
          </template>
          <template #description>
            <p>
              Do not put any real card information on the form below, this is
              only to simulate an ecommerce checkout page with a dummy payment
              form that Nethone will scan. Nethone will profile the page to
              check for any possible fraud signals. Modify your customer data
              and submit the inquiry, Nethone will respond with the
              recommendation on what to do next. Do not edit the values for
              <kbd class="font-bold">attempt_reference</kbd> and
              <kbd class="font-bold">profiling_reference</kbd>.
            </p>
          </template>
        </UAlert>
      </div>

      <!-- forms and parameters -->
      <div class="flex flex-col gap-4">
        <!-- loader -->
        <div class="w-full space-y-1" v-if="!isProfilingComplete">
          <label class="text-sm font-semibold">
            Nethone profiling script is running...
          </label>
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-full" />
        </div>

        <!-- content -->
        <div v-else class="flex flex-row gap-4">
          <!-- left -->
          <div class="flex w-1/2 flex-col gap-2">
            <!-- customer data -->
            <div class="flex flex-col gap-2">
              <label :for="customerDataFormId" class="text-sm font-semibold">
                Customer Data
              </label>
              <UTextarea
                :id="customerDataFormId"
                class="font-mono"
                spellcheck="false"
                :rows="25"
                color="purple"
                v-model="customerData"
              />

              <div>
                <UButton
                  color="purple"
                  variant="solid"
                  @click="submitCustomerData"
                  :loading="isLoading"
                >
                  Send Inquiry to Nethone
                </UButton>
              </div>
            </div>
          </div>

          <!-- right -->
          <div class="flex w-1/2 flex-col gap-2">
            <div class="w-full space-y-1" v-if="isLoading">
              <label class="text-sm font-semibold">
                Fetching recommendation...
              </label>
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-full" />
            </div>

            <div class="flex flex-col gap-2" v-if="displayData && !isLoading">
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
          </div>
        </div>

        <div class="flex">
          <!-- dummy checkout page -->
          <div class="w-1/3">
            <h1 class="text-sm">Dummy store checkout page</h1>
            <div
              class="flex flex-col gap-2 rounded border border-black/20 p-6 shadow"
            >
              <p class="font-semibold">Please input your credit card details</p>

              <form
                action=""
                method="post"
                class="flex w-full flex-col gap-3 border p-4"
              >
                <div class="flex flex-col gap-1">
                  <label :for="ccNumberId" class="text-sm font-semibold">
                    Card Number
                  </label>
                  <UInput
                    :id="ccNumberId"
                    type="text"
                    icon="i-heroicons-credit-card"
                    color="purple"
                    variant="outline"
                    placeholder="4200 XXXX XXXX XXXX"
                    autocomplete="cc-number"
                  />
                </div>

                <div class="flex flex-col gap-1">
                  <label :for="ccExpMoId" class="text-sm font-semibold">
                    Expiry Month
                  </label>
                  <UInput
                    :id="ccExpMoId"
                    type="number"
                    icon="i-heroicons-calendar-days"
                    color="purple"
                    variant="outline"
                    placeholder="05"
                    autocomplete="cc-number"
                  />
                </div>

                <div class="flex flex-col gap-1">
                  <label :for="ccExpYrId" class="text-sm font-semibold">
                    Expiry Year
                  </label>
                  <UInput
                    :id="ccExpYrId"
                    type="number"
                    icon="i-heroicons-calendar"
                    color="purple"
                    variant="outline"
                    placeholder="2XXX"
                    autocomplete="cc-number"
                  />
                </div>

                <div>
                  <label :for="ccCvvId" class="text-sm font-semibold">
                    CVV
                  </label>
                  <UInput
                    :id="ccCvvId"
                    type="number"
                    icon="i-heroicons-credit-card-20-solid"
                    color="purple"
                    variant="outline"
                    placeholder="XXX"
                    autocomplete="cc-number"
                  />
                </div>

                <div>
                  <UTooltip
                    text="No data will be submitted, this will only reload the page."
                  >
                    <UButton type="submit" color="purple" variant="solid">
                      Submit Payment
                    </UButton>
                  </UTooltip>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  // libs
  import { useAxios } from '@vueuse/integrations/useAxios'

  useUpdateTitle('Inquiry')

  // states
  const isProfilingComplete = useState<boolean>('isProfilingComplete')
  const ccNumberId = useId()
  const ccExpMoId = useId()
  const ccExpYrId = useId()
  const ccCvvId = useId()
  const customerDataFormId = useId()
  const customerData = ref()
  const displayDataInputID = useId()
  const nethoneAttemptReference = useState<string>('nethoneAttemptReference')
  const nethoneProfilingReference = useState<string>(
    'nethoneProfilingReference'
  )
  const { execute, data, isLoading } = useAxios(
    '/api/Nethone/inquiry',
    {
      method: 'POST',
    },
    { immediate: false }
  )
  const displayData = ref('')

  /**
   *
   */
  const submitCustomerData = async () => {
    try {
      const parsedPayload = JSON.parse(customerData.value)

      try {
        await execute({
          data: parsedPayload,
        })

        displayData.value = JSON.stringify(data.value, undefined, 2)
      } catch (error) {
        console.error(error)
      }

      //
    } catch (error) {
      alert(`Invalid JSON format, please check your customer data.\n\n${error}`)
    }
  }

  /**
   *
   */
  const buildDefaultPayload = (): string => {
    return JSON.stringify(
      {
        attempt_reference: nethoneAttemptReference.value,
        profiling_reference: nethoneProfilingReference.value,
        customer: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          gender: 'male',
          nationality: 'US',
          billing_address: {
            city: 'Stockton',
            name: 'John Doe',
            region: 'US-CA',
            street: '5756 Pacific Ave #95',
            country: 'US',
            postal_code: '95207',
          },
          delivery_address: {
            city: 'Stockton',
            name: 'John Doe',
            region: 'US-CA',
            street: '5756 Pacific Ave #95',
            country: 'US',
            postal_code: '95207',
          },
        },
        payment_methods: [
          {
            method: 'card',
            card_bin_number: '424242',
            card_expiry_year: 2030,
            card_expiry_month: 12,
            value: {
              amount: '11.30',
              currency: 'EUR',
            },
          },
        ],
        transaction_currency: 'EUR',
        transaction_amount: '11.30',
        items: [
          {
            type: 'generic',
            id: 'DUMMY_PRODUCT_ID_001',
            price: {
              amount: '11.30',
              currency: 'EUR',
            },
            quantity: 1,
            brand: 'DUMMY_BRAND_NAME',
            category: 'DUMMY_CATEGORY',
          },
        ],
      },
      undefined,
      2
    )
  }

  /**
   *
   */
  onMounted(async () => {
    // init Nethone and run profiling
    await useInitNethone()

    customerData.value = buildDefaultPayload()
  })
</script>
