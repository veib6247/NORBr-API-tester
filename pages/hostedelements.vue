<template>
  <div class="flex flex-col gap-4">
    <div>
      <h1 class="text-xl font-semibold">Hosted Elements</h1>
    </div>

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

          <!-- wrapper: checkout id -->
          <div class="flex flex-col gap-1">
            <label for="checkoutId" class="text-sm font-semibold">
              Checkout ID
            </label>
            <input
              type="text"
              name="checkoutId"
              class="font-mono"
              v-model="checkoutId"
            />
          </div>

          <!-- wrapper: public key -->
          <div class="flex flex-col gap-1">
            <label for="public_key" class="text-sm font-semibold">
              Public Key
            </label>
            <input
              type="text"
              autocomplete="new-password"
              name="public_key"
              class="font-mono"
              v-model="publicKey"
            />
            <label for="public_key" class="text-xs opacity-70">
              This is used by NORBr's frontend Javascript lib to authorize the
              use for their Hosted Solution
            </label>
          </div>

          <!-- wrapper: locale -->
          <div class="flex flex-col gap-1">
            <label for="checkoutId" class="text-sm font-semibold">
              Locale
            </label>
            <input
              type="text"
              name="locale"
              class="font-mono"
              v-model="locale"
            />
          </div>

          <!-- wrapper: token type -->
          <div class="flex flex-col gap-1">
            <label for="checkoutId" class="text-sm font-semibold">
              Token type
            </label>
            <select v-model="selectedTokenType">
              <option v-for="tokenType in tokenTypes" :value="tokenType">
                {{ tokenType }}
              </option>
            </select>
          </div>

          <!-- wrapper for checkboxes -->
          <div class="flex gap-8">
            <!-- wrapper: displayButtons -->
            <div class="flex gap-2">
              <label for="displayButtons" class="my-auto text-sm font-semibold">
                Display Buttons
              </label>
              <input
                type="checkbox"
                name="displayButtons"
                class="my-auto"
                v-model="displayButtons"
              />
            </div>

            <!-- wrapper: displayCardHolder -->
            <div class="flex gap-2">
              <label
                for="displayCardHolder"
                class="my-auto text-sm font-semibold"
              >
                Display Cardholder
              </label>
              <input
                type="checkbox"
                name="displayCardHolder"
                class="my-auto"
                v-model="displayCardHolder"
              />
            </div>

            <!-- wrapper: displaySave -->
            <div class="flex gap-2">
              <label for="displaySave" class="my-auto text-sm font-semibold">
                Display Save
              </label>
              <input
                type="checkbox"
                name="displaySave"
                class="my-auto"
                v-model="displaySave"
              />
            </div>
          </div>

          <!-- wrapper: CardHolderValue -->
          <div class="flex flex-col gap-1">
            <label for="checkoutId" class="text-sm font-semibold">
              Cardholder Value
            </label>
            <input
              type="text"
              name="CardHolderValue"
              class="font-mono"
              v-model="cardHolderValue"
            />
          </div>
        </form>

        <!-- NORBr hosted solution -->
        <div class="w-1/2 bg-purple-100 p-4" id="norbr-payment-container"></div>
      </div>

      <!-- submit -->
      <div class="flex gap-4">
        <button
          class="rounded bg-purple-950 px-4 py-2 text-white hover:bg-purple-900 active:scale-95"
          @click="initNorbr"
        >
          Initialize Payment Form
        </button>

        <div class="flex gap-2">
          <label for="autoOrder" class="my-auto text-sm font-semibold">
            Automatically submit order upon clicking "Pay"
          </label>
          <input
            type="checkbox"
            name="autoOrder"
            class="my-auto"
            v-model="autoOrder"
          />
        </div>
      </div>

      <!-- wrapper: response -->
      <div class="flex flex-col gap-1" v-if="hostedElementsResponse">
        <label for="hostedElementsResponse" class="text-sm font-semibold">
          Hosted Elements Response
        </label>
        <textarea
          name="hostedElementsResponse"
          rows="25"
          class="font-mono text-sm"
          spellcheck="false"
          readonly
          v-model="hostedElementsResponse"
        >
        </textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  // page setup
  useUpdateTitle('Hosted Elements')

  // states
  const privateKey = useState('privateKey')
  const publicKey = ref('')
  const checkoutId = useState('checkoutId')
  const locale = ref('en')
  const tokenTypes = ref(['oneshot', 'recurring'])
  const selectedTokenType = ref(tokenTypes.value[0])
  const displayButtons = ref(true)
  const displayCardHolder = ref(true)
  const displaySave = ref(false)
  const cardHolderValue = ref('')
  const hostedElementsResponse = ref('')
  const autoOrder = ref(false)
  const paymentMethodsAvailable = useState('paymentMethodsAvailable')

  /**
   *
   */
  const initNorbr = () => {
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
