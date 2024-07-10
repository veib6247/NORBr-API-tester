<template>
  <div class="flex h-dvh">
    <!-- nav -->
    <div class="flex h-dvh w-72 flex-col bg-purple-950">
      <!-- general nav -->
      <nav class="flex flex-col gap-1 p-6">
        <h1 class="text-sm font-semibold uppercase text-white opacity-60">
          App
        </h1>
        <NavLink route-to="/"><IconHome /> Home</NavLink>
      </nav>

      <!-- nav for NORBr -->
      <nav class="flex flex-col gap-1 p-6">
        <h1 class="text-sm font-semibold uppercase text-white opacity-60">
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
        <h1 class="text-sm font-semibold uppercase text-white opacity-60">
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

  // states
  const appName = useState('appName', () => 'NORBr API Tester')
  const colorMode = useColorMode()
  const privateKey = useState('privateKey', () => '')
  colorMode.value = 'light'

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

    /**
     * nethone init code for profiling
     */

    // Behavioral data parameters
    const options = {
      attemptReference: 'attempt_reference',
      sensitiveFields: ['number', 'cvc'],
    }

    // @ts-ignore
    if (window.dftp) {
      // @ts-ignore
      dftp.init(options)
    } else {
      const el = document.getElementById('nethone_script')

      if (el) {
        el.addEventListener('load', () => {
          // @ts-ignore
          dftp.init(options)
        })
      }
    }
  })
</script>
