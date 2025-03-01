<template>
  <div class="container mx-auto flex flex-col gap-4">
    <AppPageTitle> Order </AppPageTitle>

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
          <UTooltip
            text="Submit Order"
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

        <UFormGroup label="Use JSON Payload">
          <UToggle color="purple" size="sm" v-model="isJsonPayload" />
        </UFormGroup>

        <div class="flex gap-4">
          <!-- wrapper: data parameters and submit button -->
          <div class="flex w-1/2 flex-col gap-1">
            <label :for="dataParametersInputID" class="text-sm font-semibold">
              Data Parameters
            </label>

            <UTooltip
              text="Submit Order"
              :shortcuts="['ctrl', 'Enter']"
              :popper="{ placement: 'top' }"
            >
              <UTextarea
                :id="dataParametersInputID"
                class="w-full font-mono"
                spellcheck="false"
                :rows="25"
                color="purple"
                v-model="dataParameters"
                @keyup.ctrl.enter="submitData"
                v-if="!isJsonPayload"
              />

              <UTextarea
                :id="dataParametersInputID"
                class="w-full font-mono"
                spellcheck="false"
                :rows="25"
                color="purple"
                v-model="jsonParameters"
                @keyup.ctrl.enter="submitData"
                v-else
              />
            </UTooltip>
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
                :loading="isLoading"
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
                A redirect URL is detected,
                <a
                  :href="data.redirect_url"
                  rel="noopener noreferrer"
                  class="underline"
                >
                  click here
                </a>
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
</template>

<script lang="ts" setup>
  import { useAxios } from '@vueuse/integrations/useAxios'

  // page setups
  useUpdateTitle('Order')

  // states
  const privateKey = useState<string>('privateKey')
  const privateKeyInputID = useId()
  const storageprivateKey = useState('storageprivateKey')
  const dataParameters = ref('')
  const dataParametersInputID = useId()
  const defaultParams = ref(['token=REPLACE_ME', 'checkout_id=REPLACE_ME'])
  const displayData = ref('')
  const displayDataInputID = useId()
  const storateOrderId = useState('storageOrderId')
  const isJsonPayload = ref(true)
  const jsonParameters = ref('')
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
    // validate JSON string
    try {
      JSON.parse(jsonParameters.value)
    } catch (error) {
      console.error(error)
      alert('Invalid JSON string!')

      return
    }

    storageprivateKey.value = privateKey.value
    event.preventDefault()

    data.value = ''

    try {
      await execute({
        data: {
          isJsonPayload: isJsonPayload.value,
          jsonParameters: jsonParameters.value,
          privateKey: privateKey.value,
          dataParameters: dataParameters.value,
        },
      })

      // store the order Id in session storage
      storateOrderId.value = data.value.order_id || ''
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
      `accept_url=${window.location.origin}/NORBr/redirect?status=accept`,
      `decline_url=${window.location.origin}/NORBr/redirect?status=decline`,
      `pending_url=${window.location.origin}/NORBr/redirect?status=pending`,
      `exception_url=${window.location.origin}/NORBr/redirect?status=exception`,
    ]

    defaultParams.value = [...defaultParams.value, ...urls]
    dataParameters.value = defaultParams.value.join('\n')

    const defaultJsonPayload = {
      token: 'REPLACE_ME',
      checkout_id: 'REPLACE_ME',
      accept_url: `${window.location.origin}/NORBr/redirect?status=accept`,
      decline_url: `${window.location.origin}/NORBr/redirect?status=decline`,
      pending_url: `${window.location.origin}/NORBr/redirect?status=pending`,
      exception_url: `${window.location.origin}/NORBr/redirect?status=exception`,
    }

    jsonParameters.value = JSON.stringify(defaultJsonPayload, undefined, 2)
  })
</script>
