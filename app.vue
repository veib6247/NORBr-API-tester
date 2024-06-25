<template>
  <div class="flex h-dvh">
    <!-- nav -->
    <div class="h-dvh w-72 bg-purple-950">
      <nav class="flex flex-col gap-1 p-6">
        <NavLink route-to="/"><IconHome /> Home</NavLink>
        <NavLink route-to="/checkout"><IconCart /> Checkout</NavLink>
        <NavLink route-to="/hostedelements">
          <IconShoppingbag /> Hosted Elements
        </NavLink>
        <NavLink route-to="/order"><IconCash /> Order</NavLink>
        <NavLink route-to="/maintenance"><IconReload /> Maintenance</NavLink>
        <NavLink route-to="/redirect"><IconRedirect /> Redirect</NavLink>
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
   *
   */
  onMounted(() => {
    const storagePrivateKey = useState('storageprivateKey', () => {
      return useStorage('privateKey', '', sessionStorage, {
        mergeDefaults: true,
      })
    })

    privateKey.value = storagePrivateKey.value
  })
</script>
