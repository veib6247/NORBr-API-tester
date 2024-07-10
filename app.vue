<template>
  <div class="flex h-dvh">
    <!-- nav -->
    <div class="flex h-dvh w-72 flex-col bg-purple-950">
      <!-- general nav -->
      <nav class="flex flex-col gap-1 p-6">
        <h1 class="text-xs font-semibold uppercase text-white opacity-60">
          App
        </h1>
        <NavLink route-to="/"><IconHome /> Home</NavLink>
      </nav>

      <!-- nav for NORBr -->
      <nav class="flex flex-col gap-1 p-6">
        <h1 class="text-xs font-semibold uppercase text-white opacity-60">
          NORBr
        </h1>
        <NavLink route-to="/NORBr/checkout"><IconCart /> Checkout</NavLink>
        <NavLink route-to="/NORBr/hostedelements">
          <IconShoppingbag /> Hosted Elements
        </NavLink>
        <NavLink route-to="/NORBr/order"><IconCash /> Order</NavLink>
        <NavLink route-to="/NORBr/maintenance"
          ><IconReload /> Maintenance</NavLink
        >
        <NavLink route-to="/NORBr/redirect"><IconRedirect /> Redirect</NavLink>
      </nav>

      <!-- nav for Nethone -->
      <nav class="flex flex-col gap-1 p-6">
        <h1 class="text-xs font-semibold uppercase text-white opacity-60">
          Nethone
        </h1>
        <NavLink route-to="/Nethone/inquiry"><IconInfo /> Inquiry</NavLink>
      </nav>
    </div>

    <!-- content -->
    <div class="flex h-dvh w-full flex-col overflow-auto p-6">
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
  const colorMode = useColorMode()
  const privateKey = useState('privateKey', () => '')
  colorMode.value = 'light'
  useState<string>('nethoneAttemptReference', () => {
    return nanoid()
  })

  // composables
  useHead({
    title: appName.value,
  })

  /**
   * run these once browser is ready to read stuff
   */
  onMounted(() => {
    /**
     * init storage for private key
     */
    const storagePrivateKey = useState('storageprivateKey', () => {
      return useStorage('privateKey', '', sessionStorage, {
        mergeDefaults: true,
      })
    })
    privateKey.value = storagePrivateKey.value

    // init Nethone profiling
    useInitNethone()
  })
</script>
