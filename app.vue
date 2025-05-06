<template>
  <div class="flex h-dvh max-h-dvh flex-col">
    <!-- nav -->
    <div class="h-14 w-full">
      <NavHorizontal />
    </div>

    <!-- content -->
    <div class="flex h-full w-full flex-col overflow-auto">
      <div class="mb-2 mt-2">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // libs
  import { useStorage } from '@vueuse/core'
  import { nanoid } from 'nanoid'

  // states
  const appName = useState('appName', () => 'NORBr API Tester')
  const colorMode = useColorMode()
  const privateKey = useState('privateKey', () => '')
  colorMode.value = 'dark'

  useState<string>('nethoneAttemptReference', () => {
    return `bidhb-${nanoid()}`
  })

  useState<string>('nethoneProfilingReference', () => {
    return `bidhb-${nanoid()}`
  })

  useState<boolean>('isProfilingComplete', () => {
    return false
  })

  useState<string>('nethoneTransactionReference', () => {
    return `bidhb-${nanoid()}`
  })

  useState<string>('nethoneMerchantReference', () => {
    return `bidhb-${nanoid()}`
  })

  // composables
  useHead({
    title: appName.value,
  })

  /**
   * run these once browser is ready to read stuff
   */
  onMounted(async () => {
    /**
     * init storage for private key
     */
    const storagePrivateKey = useState('storageprivateKey', () => {
      return useStorage('privateKey', '', sessionStorage, {
        mergeDefaults: true,
      })
    })

    privateKey.value = storagePrivateKey.value

    useState('storageOrderId', () => {
      return useStorage('orderId', '', sessionStorage, {
        mergeDefaults: true,
      })
    })
  })
</script>
