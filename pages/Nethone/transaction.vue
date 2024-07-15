<template>
  <div class="container mx-auto flex flex-col gap-4">
    <div>
      <h1 class="text-xl font-semibold">Transaction</h1>
      <p class="text-sm">
        Transactions API is designed to give you the possibility to inform our
        system about the status of transactions (i.e money tranfser, card
        charge, login or registration) so that we can tell which ones are good
        and which are fradulent.
      </p>
    </div>

    <UAlert
      title="Run Inquiry First!"
      color="yellow"
      icon="i-heroicons-exclaimation-triangle"
    >
      <template #title="{ title }">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="title" />
      </template>
      <template #description>
        <p>
          Before running this API, please ensure that you've ran an inquiry
          first.
        </p>
      </template>
    </UAlert>

    <!-- forms and parameters -->
    <div class="flex flex-col gap-4">
      <!-- content -->
      <div class="flex flex-row gap-4">
        <!-- left -->
        <div class="flex w-1/2 flex-col gap-2">
          <!-- customer data -->
          <div class="flex flex-col gap-2">
            <label :for="customerDataFormId" class="text-sm font-semibold">
              Transaction Data
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
                Send Transaction to Nethone
              </UButton>
            </div>
          </div>
        </div>

        <!-- right -->
        <div class="flex w-1/2 flex-col gap-2">
          <div class="w-full space-y-1" v-if="isLoading">
            <label class="text-sm font-semibold"> Fetching response... </label>
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
    </div>
  </div>
</template>

<script lang="ts" setup>
  // libs
  import { useAxios } from '@vueuse/integrations/useAxios'

  useUpdateTitle('Transaction')

  // states
  const customerDataFormId = useId()
  const customerData = ref()
  const displayDataInputID = useId()
  const { execute, data, isLoading } = useAxios(
    '/api/Nethone/transaction',
    {
      method: 'POST',
    },
    { immediate: false }
  )
  const displayData = ref('')

  const nethoneTransactionReference = useState<string>(
    'nethoneTransactionReference'
  )

  const nethoneMerchantReference = useState<string>('nethoneMerchantReference')

  const nethoneProfilingReference = useState<string>(
    'nethoneProfilingReference'
  )

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
      alert('Invalid JSON format, please check your customer data.')
    }
  }

  /**
   *
   */
  onMounted(async () => {
    customerData.value = JSON.stringify(
      {
        reference: nethoneTransactionReference.value,
        merchant_reference: nethoneMerchantReference.value,
        payment_method: 'card',
        user_reference: 'PUT_DUMMY_USER_REFERENCE_HERE',
        profiling_reference: nethoneProfilingReference.value,
        timestamp: `${buildTimestamp()}`,
        currency: 'USD',
        amount: '599.99',
        card_token: 'PUT_DUMMY_CARD_TOKEN_HERE',
        extra_data: {},
        flags: [
          {
            timestamp: `${buildTimestamp()}`,
            name: 'accepted',
            value: true,
            extra_data: {},
            comment: '',
          },
        ],
        inquiry_id: 'PUT_INQUIRY_ID_HERE',
      },
      undefined,
      2
    )
  })

  /**
   *
   */
  const buildTimestamp = (): string => {
    const currentDate = new Date()
    const month = zeroPad(currentDate.getMonth() + 1)
    const date = zeroPad(currentDate.getDate())
    const hours = zeroPad(currentDate.getHours())
    const minutes = zeroPad(currentDate.getMinutes())
    const seconds = zeroPad(currentDate.getSeconds())

    return `${currentDate.getFullYear()}-${month}-${date} ${hours}:${minutes}:${seconds}`
  }

  /**
   * add zero padding for single digit number
   * @param digit
   */
  const zeroPad = (digit: number): string => {
    if (digit < 10) {
      return `0${digit}`
    }

    return `${digit}`
  }
</script>
