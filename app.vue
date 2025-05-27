<template>
  <div class="flex h-dvh max-h-dvh flex-col overflow-hidden">
    <!-- top nav bar -->
    <NavHorizontal />

    <!-- content -->
    <div class="flex h-full max-h-full w-full flex-col">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
  // libs
  import { useStorage } from '@vueuse/core'
  import { nanoid } from 'nanoid'

  // states
  const appName = useState('appName', () => 'NORBr API Tester')
  const privateKey = useState('privateKey', () => '')

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

  useState<number>('versionNumber', () => 2.3)

  // composables
  useHead({
    title: appName.value,
  })

  /**
   * run these once browser is ready to read stuff
   */
  onMounted(async () => {
    const nuxtColorMode = useStorage('nuxt-color-mode', 'dark', localStorage, {
      mergeDefaults: true,
    })

    nuxtColorMode.value = useColorMode().value
    console.info(`Using color mode: '${nuxtColorMode.value}'`)

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
