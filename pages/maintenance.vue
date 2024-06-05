<template>
  <div class="flex flex-col gap-4">
    <div>
      <h1 class="text-xl font-semibold">Maintenance</h1>
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

        <!-- wrapper: Maintenance type -->
        <div class="flex flex-col gap-1">
          <label for="maintenanceType" class="text-sm font-semibold">
            Maintenance Type
          </label>
          <select name="maintenanceType" v-model="selectedmaintenanceType">
            <option
              v-for="maintenanceType in maintenanceTypes"
              :value="maintenanceType"
            >
              {{ maintenanceType }}
            </option>
          </select>
        </div>

        <!-- wrapper: orderId -->
        <div class="flex flex-col gap-1">
          <label for="orderId" class="text-sm font-semibold"> Order ID </label>
          <input
            type="text"
            name="orderId"
            class="font-mono"
            v-model="orderId"
          />
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
                href="https://developer.norbr.io/#acd2a805-dab1-4d5c-8651-5a423bd8c7b9"
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
              v-model="displayData"
              readonly
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
          Submit {{ selectedmaintenanceType }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useAxios } from '@vueuse/integrations/useAxios'

  // page setups
  useUpdateTitle('Maintenance')

  // states
  const privateKey = useState('privateKey')
  const dataParameters = ref('')
  const defaultParams = ['amount=11.30']
  dataParameters.value = defaultParams.join('\n')
  const displayData = ref('')
  const orderId = useState('orderId')
  const maintenanceTypes = ref(['capture', 'refund', 'cancel'])
  const selectedmaintenanceType = ref(maintenanceTypes.value[0])

  /**
   *
   */
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
  const submitData = async () => {
    data.value = ''

    try {
      await execute({
        data: {
          orderId: orderId.value,
          maintenanceType: selectedmaintenanceType.value,
          privateKey: privateKey.value,
          dataParameters: dataParameters.value,
        },
      })

      displayData.value = JSON.stringify(data.value, undefined, 2)

      //
    } catch (error) {
      console.error(error)
    }
  }
</script>
