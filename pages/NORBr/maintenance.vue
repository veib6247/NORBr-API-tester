<script lang="ts" setup>
  import { useAxios } from '@vueuse/integrations/useAxios'

  // page setups
  useUpdateTitle('Maintenance')

  // states
  const privateKey = useState<string>('privateKey')
  const privateKeyInputID = useId()
  const versionNumberID = useId()
  const versionNumber = useState<number>('versionNumber')
  const storageprivateKey = useState('storageprivateKey')
  const dataParameters = ref('')
  const dataParametersInputID = useId()
  const defaultParams = ['amount=11.30']
  const displayData = ref('')
  const displayDataInputID = useId()
  const storageOrderId = useState<string>('storageOrderId')
  const orderIdInputID = useId()
  const maintenanceTypes = ref(['capture', 'refund', 'cancel'])
  const selectedmaintenanceType = ref(maintenanceTypes.value[0])
  const selectedmaintenanceTypeInputID = useId()
  const { execute, data, isLoading } = useAxios(
    '/api/maintenance',
    {
      method: 'POST',
    },
    { immediate: false }
  )

  /**
   *
   */
  async function submitData() {
    storageprivateKey.value = privateKey.value
    data.value = ''

    const payload: RequestBody = {
      orderId: storageOrderId.value,
      maintenanceType: selectedmaintenanceType.value,
      privateKey: privateKey.value,
      versionNumber: versionNumber.value,
      isJsonPayload: false,
      dataParameters: dataParameters.value,
    }

    try {
      await execute({
        data: payload,
      })

      displayData.value = JSON.stringify(data.value, undefined, 2)

      //
    } catch (error) {
      console.error(error)
    }
  }

  /**
   *
   */
  onMounted(() => {
    dataParameters.value = defaultParams.join('\n')
  })
</script>

<template>
  <div class="flex h-full">
    <div class="h-full max-h-full w-2/12">
      <NavNorbr />
    </div>

    <div class="flex w-10/12 flex-col gap-4 overflow-auto px-10 pb-20 pt-4">
      <AppPageTitle> Maintenance </AppPageTitle>

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
              :text="`Submit ${selectedmaintenanceType}`"
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
              frontend. This is only for testing purposes.
            </label>
          </div>

          <!-- wrapper: version number -->
          <div class="flex w-1/2 flex-col gap-1">
            <label :for="versionNumberID" class="text-sm font-semibold">
              Version Number
            </label>
            <UTooltip
              :text="`Submit ${selectedmaintenanceType}`"
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

          <!-- wrapper: Maintenance type -->
          <div class="flex w-1/2 flex-col gap-1">
            <label
              :for="selectedmaintenanceTypeInputID"
              class="text-sm font-semibold"
            >
              Maintenance Type
            </label>
            <USelect
              :id="selectedmaintenanceTypeInputID"
              icon="i-heroicons-briefcase"
              color="purple"
              v-model="selectedmaintenanceType"
              :options="maintenanceTypes"
            />
          </div>

          <!-- wrapper: orderId -->
          <div class="flex w-1/2 flex-col gap-1">
            <label :for="orderIdInputID" class="text-sm font-semibold">
              Order ID
            </label>
            <UTooltip
              :text="`Submit ${selectedmaintenanceType}`"
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

          <div class="flex gap-4">
            <!-- wrapper: data parameters -->
            <div class="flex w-1/2 flex-col gap-1">
              <label :for="dataParametersInputID" class="text-sm font-semibold">
                Data Parameters
              </label>
              <UTooltip
                :text="`Submit ${selectedmaintenanceType}`"
                :shortcuts="['ctrl', 'Enter']"
                :popper="{ placement: 'top' }"
              >
                <UTextarea
                  :id="dataParametersInputID"
                  class="w-full font-mono"
                  spellcheck="false"
                  placeholder="Data parameters..."
                  :rows="16"
                  color="purple"
                  v-model="dataParameters"
                  @keyup.ctrl.enter="submitData"
                />
              </UTooltip>
              <label :for="dataParametersInputID" class="text-xs opacity-70">
                For a full list of parameters, check
                <AppLink
                  to="https://developer.norbr.io/#acd2a805-dab1-4d5c-8651-5a423bd8c7b9"
                  label="here"
                />.
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
                :rows="16"
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
            :loading="isLoading"
            :label="`Submit ${selectedmaintenanceType}`"
            @click="submitData"
          />
        </div>
      </div>
    </div>
  </div>
</template>
