<template>
  <div class="container mx-auto flex flex-col gap-4">
    <AppPageTitle> Hosted Elements </AppPageTitle>

    <div class="flex flex-col gap-4">
      <div class="flex gap-4">
        <!-- form -->
        <form class="flex w-1/2 flex-col gap-2">
          <!-- wrapper: private key -->
          <div class="flex flex-col gap-1">
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
              text="Submit - Initialize Payment Form"
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
                @keyup.ctrl.enter="initNorbr"
              />
            </UTooltip>

            <label :for="privateKeyInputID" class="text-xs opacity-70">
              In general practice, the private key should not be exposed to the
              frontend. This is only for testing purposes
            </label>
          </div>

          <!-- wrapper: public key -->
          <div class="flex flex-col gap-1">
            <label :for="publicKeyInputID" class="text-sm font-semibold">
              Public Key
            </label>
            <UTooltip
              text="Submit - Initialize Payment Form"
              :shortcuts="['ctrl', 'Enter']"
              :popper="{ placement: 'top' }"
            >
              <UInput
                :id="publicKeyInputID"
                class="w-full"
                icon="i-heroicons-key"
                color="purple"
                placeholder="Public Key"
                v-model="publicKey"
                @keyup.ctrl.enter="initNorbr"
              />
            </UTooltip>
            <label :for="publicKeyInputID" class="text-xs opacity-70">
              This is used by NORBr's frontend Javascript lib to authorize the
              use for their Hosted Solution
            </label>
          </div>

          <!-- wrapper: checkout id -->
          <div class="flex flex-col gap-1">
            <label :for="checkoutIdInputID" class="text-sm font-semibold">
              Checkout ID
            </label>
            <UTooltip
              text="Submit - Initialize Payment Form"
              :shortcuts="['ctrl', 'Enter']"
              :popper="{ placement: 'top' }"
            >
              <UInput
                :id="checkoutIdInputID"
                class="w-full"
                icon="i-heroicons-identification"
                color="purple"
                placeholder="Checkout ID"
                v-model="checkoutId"
                @keyup.ctrl.enter="initNorbr"
              />
            </UTooltip>
          </div>

          <!-- wrapper: locale -->
          <div class="flex flex-col gap-1">
            <label :for="localeInputId" class="text-sm font-semibold">
              Locale
            </label>
            <UTooltip
              text="Submit - Initialize Payment Form"
              :shortcuts="['ctrl', 'Enter']"
              :popper="{ placement: 'top' }"
            >
              <UInput
                :id="localeInputId"
                class="w-full"
                icon="i-heroicons-language"
                color="purple"
                placeholder="Checkout ID"
                v-model="locale"
                @keyup.ctrl.enter="initNorbr"
              />
            </UTooltip>
          </div>

          <!-- wrapper: token type -->
          <div class="flex flex-col gap-1">
            <label :for="tokenTypesInputID" class="text-sm font-semibold">
              Token type
            </label>
            <USelect
              :id="tokenTypesInputID"
              icon="i-heroicons-ticket"
              color="purple"
              v-model="selectedTokenType"
              :options="tokenTypes"
            />
          </div>

          <!-- wrapper: CardHolderValue -->
          <div class="flex flex-col gap-1">
            <label :for="cardHolderValueInputID" class="text-sm font-semibold">
              Cardholder Value
            </label>
            <UTooltip
              text="Submit - Initialize Payment Form"
              :shortcuts="['ctrl', 'Enter']"
              :popper="{ placement: 'top' }"
            >
              <UInput
                :id="cardHolderValueInputID"
                class="w-full"
                icon="i-heroicons-user"
                color="purple"
                placeholder="Cardholder Value"
                v-model="cardHolderValue"
                @keyup.ctrl.enter="initNorbr"
              />
            </UTooltip>
          </div>

          <!-- wrapper for checkboxes -->
          <div class="flex gap-8">
            <!-- wrapper: displayButtons -->
            <UCheckbox
              color="purple"
              name="displayButtons"
              label="Display Buttons"
              v-model="displayButtons"
            />

            <!-- wrapper: displayCardHolder -->
            <UCheckbox
              color="purple"
              name="displayCardHolder"
              label="Display Cardholder"
              v-model="displayCardHolder"
            />

            <!-- wrapper: displaySave -->
            <UCheckbox
              color="purple"
              name="displaySave"
              label="Display Save"
              v-model="displaySave"
            />
          </div>

          <!-- submit -->
          <div class="mt-10 flex gap-4">
            <UButton
              icon="i-heroicons-code-bracket-square"
              color="purple"
              label="Initialize Payment Form"
              @click="initNorbr"
            />

            <div class="my-auto">
              <UCheckbox
                color="purple"
                name="autoOrder"
                label="Automatically submit order upon clicking 'Pay'"
                v-model="autoOrder"
              />
            </div>
          </div>
        </form>

        <!-- NORBr hosted solution -->
        <div
          class="flex w-1/2 bg-purple-100 p-4"
          v-if="!hostedElementsResponse"
        >
          <div id="norbr-payment-container" class="m-auto"></div>
        </div>

        <!-- wrapper: response -->
        <div class="flex w-1/2 flex-col gap-1" v-if="hostedElementsResponse">
          <label
            :for="hostedElementsResponseInputID"
            class="text-sm font-semibold"
          >
            Hosted Elements Response
          </label>
          <UTextarea
            :id="hostedElementsResponseInputID"
            class="font-mono"
            spellcheck="false"
            :rows="25"
            color="purple"
            v-model="hostedElementsResponse"
            readonly
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  // page setup
  useUpdateTitle('Hosted Elements')

  // states
  const privateKey = useState<string>('privateKey')
  const privateKeyInputID = useId()
  const storageprivateKey = useState('storageprivateKey')
  const checkoutId = useState<string>('checkoutId')
  const checkoutIdInputID = useId()
  const publicKey = ref('')
  const publicKeyInputID = useId()
  const locale = ref('en')
  const localeInputId = useId()
  const tokenTypes = ref(['oneshot', 'recurring'])
  const selectedTokenType = ref(tokenTypes.value[0])
  const tokenTypesInputID = useId()
  const displayButtons = ref(true)
  const displayCardHolder = ref(true)
  const displaySave = ref(false)
  const cardHolderValue = ref('')
  const cardHolderValueInputID = useId()
  const hostedElementsResponse = ref('')
  const hostedElementsResponseInputID = useId()
  const autoOrder = ref(false)
  const paymentMethodsAvailable = useState('paymentMethodsAvailable')

  /**
   *
   */
  const initNorbr = () => {
    storageprivateKey.value = privateKey.value
    hostedElementsResponse.value = ''

    const configuration = {
      publicapikey: publicKey.value,
      locale: locale.value,
      environment: 'sandbox',
      tokentype: selectedTokenType.value,
      paymentmethods: JSON.stringify({
        payment_methods_available: paymentMethodsAvailable.value,
      }),
      displayButtons: displayButtons.value,
      displayCardHolder: displayCardHolder.value,
      displaySave: displaySave.value,
      CardHolderValue: cardHolderValue.value,
      onSubmit: () => {
        // clear hostedElementsResponse before refill
        hostedElementsResponse.value = ''

        if (autoOrder.value) {
          alert('This feature is still under development.')
        } else {
          hostedElementsResponse.value = JSON.stringify(norbr, undefined, 2)
        }
      },
    }

    // @ts-ignore
    const norbr = new Norbr(configuration)
  }
</script>
