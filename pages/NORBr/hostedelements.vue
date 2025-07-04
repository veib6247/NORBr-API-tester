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
  const versionNumber = ref(2.3)
  const versionNumberID = useId()
  const cssId = useId()
  const jsId = useId()
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
  const orderResponse = ref()
  const redirectUrl = ref('')
  const storageOrderId = useState('storageOrderId')

  /**
   * Initializes the NORBr hosted elements with the provided configuration.
   */
  function initNorbr() {
    storageprivateKey.value = privateKey.value
    hostedElementsResponse.value = ''
    let dataParameters = ''

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
      onSubmit: async () => {
        // clear hostedElementsResponse before refill
        hostedElementsResponse.value = ''

        // if autoOrder is checked, build the data and submit the order
        if (autoOrder.value) {
          const token = norbr.token
          dataParameters = `token=${token}\ncheckout_id=${checkoutId.value}`
          const urls = [
            `accept_url=${window.location.origin}/NORBr/redirect?status=accept`,
            `decline_url=${window.location.origin}/NORBr/redirect?status=decline`,
            `pending_url=${window.location.origin}/NORBr/redirect?status=pending`,
            `exception_url=${window.location.origin}/NORBr/redirect?status=exception`,
          ]
          for (const url of urls) {
            dataParameters += `\n${url}`
          }

          const payload: RequestBody = {
            privateKey: privateKey.value,
            dataParameters: dataParameters,
            isJsonPayload: false,
            versionNumber: versionNumber.value,
          }

          orderResponse.value = await $fetch('/api/order', {
            method: 'POST',
            body: JSON.stringify(payload),
          })

          storageOrderId.value = orderResponse.value.order_id || ''
          redirectUrl.value = orderResponse.value.redirect_url || ''

          hostedElementsResponse.value = JSON.stringify(
            orderResponse.value,
            undefined,
            2
          )
        } else {
          hostedElementsResponse.value = JSON.stringify(norbr, undefined, 2)
        }
      },
    }

    // @ts-ignore
    const norbr = new Norbr(configuration)
  }
</script>

<template>
  <div class="flex h-full">
    <div class="h-full max-h-full w-2/12">
      <NavNorbr />
    </div>

    <div class="flex w-10/12 flex-col gap-4 overflow-auto px-10 pb-20 pt-4">
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
                In general practice, the private key should not be exposed to
                the frontend. This is only for testing purposes
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

            <!-- wrapper: version number -->
            <div class="flex w-full flex-col gap-1">
              <label :for="versionNumberID" class="text-sm font-semibold">
                API Version Number
              </label>
              <UTooltip
                text="Submit - Create Checkout"
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
                  @keyup.ctrl.enter="initNorbr"
                />
              </UTooltip>
            </div>

            <!-- wrapper: CSS -->
            <div class="flex flex-col gap-1">
              <label :for="cssId" class="text-sm font-semibold">
                NORBr CSS Ref
              </label>
              <UInput
                :id="cssId"
                class="w-full text-white/5"
                icon="i-heroicons-swatch"
                type="text"
                color="purple"
                value="https://secure-assets-sandbox.norbr.io/stylesheet/2.3/norbr-client.min.css"
                disabled
              />
            </div>

            <!-- wrapper: JS -->
            <div class="flex flex-col gap-1">
              <label :for="jsId" class="text-sm font-semibold">
                NORBr JS Ref
              </label>
              <UInput
                :id="jsId"
                class="w-full text-white/5"
                icon="i-heroicons-code-bracket"
                type="text"
                color="purple"
                value="https://secure-assets-sandbox.norbr.io/javascript/2.3/norbr-client.min.js"
                disabled
              />
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
              <label
                :for="cardHolderValueInputID"
                class="text-sm font-semibold"
              >
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
          <div class="flex w-1/2 flex-col gap-2">
            <!-- CSS disclaimer -->
            <UAlert
              title="Heads up!"
              color="purple"
              icon="i-heroicons-exclaimation-triangle"
            >
              <template #title="{ title }">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="title" />
              </template>
              <template #description>
                The payment form below is intentionally left <b>unstyled</b> in
                order to show the default look before a merchant applies their
                own CSS. NORBr also prefers to closely work with them when
                styling the form to prevent any unintended issues.
              </template>
            </UAlert>

            <div
              class="flex flex-col bg-white p-8"
              v-if="!hostedElementsResponse"
            >
              <div id="norbr-payment-container" class="no-tailwind"></div>
            </div>

            <!-- wrapper: response -->
            <div
              class="flex w-full flex-col gap-1"
              v-if="hostedElementsResponse"
            >
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

              <UAlert
                title="Heads up!"
                color="purple"
                icon="i-heroicons-information-circle"
                v-if="redirectUrl"
              >
                <template #title="{ title }">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <span v-html="title" />
                </template>

                <template #description>
                  A redirect URL is detected,
                  <a
                    :href="redirectUrl"
                    rel="noopener noreferrer"
                    class="underline"
                  >
                    click here
                  </a>
                  to view the page.
                </template>
              </UAlert>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .no-tailwind {
    all: unset; /* Reset all styles */
  }

  .no-tailwind * {
    all: unset; /* Reset styles for all child elements */
  }
</style>
