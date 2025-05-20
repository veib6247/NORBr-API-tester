<script lang="ts" setup>
  const secretId = useId()
  const secret = ref('')
  const ivId = useId()
  const iv = ref('')
  const authTagId = useId()
  const authTag = ref('')
  const httpBodyId = useId()
  const httpBody = ref('')
  const serverResponseId = useId()
  const serverResponse = ref('')

  /**
   * submit data to server for decryption
   */
  const submitData = async () => {
    serverResponse.value = ''

    const payload = {
      secret: secret.value,
      iv: iv.value,
      authTag: authTag.value,
      httpBody: httpBody.value,
    }

    try {
      const res = await $fetch('/api/Paysourcing/decryptor', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      serverResponse.value = JSON.stringify(res, undefined, 2)

      //
    } catch (error) {
      serverResponse.value = ''
      console.error('Error decrypting data:', error)
    }
  }
</script>

<template>
  <div class="flex h-full">
    <div class="h-full max-h-full w-2/12"></div>

    <div class="flex w-10/12 flex-col gap-4 overflow-auto px-10 pb-20 pt-4">
      <AppPageTitle> Webhook Decryptor </AppPageTitle>

      <div class="flex w-full gap-4">
        <!-- form -->
        <div class="flex w-1/2 flex-col gap-4">
          <!-- wrapper: BIP secret -->
          <div class="flex flex-col gap-1">
            <input
              type="text"
              autocomplete="username"
              name="dummy_username"
              class="hidden"
            />
            <label :for="secretId" class="text-sm font-semibold">
              BIP Secret
            </label>
            <UInput
              :id="secretId"
              class="w-full"
              icon="i-heroicons-key"
              type="text"
              color="purple"
              placeholder="BIP Secret"
              v-model="secret"
              autocomplete="new-password"
            />

            <label :for="secretId" class="text-xs opacity-70">
              This is the secret string found in BIP.
            </label>
          </div>

          <!-- wrapper: IV -->
          <div class="flex flex-col gap-1">
            <input
              type="text"
              autocomplete="username"
              name="dummy_username"
              class="hidden"
            />
            <label :for="ivId" class="text-sm font-semibold">
              Initialization Vector (IV)
            </label>
            <UInput
              :id="ivId"
              class="w-full"
              icon="i-heroicons-presentation-chart-line"
              type="text"
              color="purple"
              placeholder="Initialization Vector"
              v-model="iv"
              autocomplete="new-password"
            />

            <label :for="ivId" class="text-xs opacity-70">
              Found in the HTTP header of the webhook request.
            </label>
          </div>

          <!-- wrapper: Auth Tag -->
          <div class="flex flex-col gap-1">
            <input
              type="text"
              autocomplete="username"
              name="dummy_username"
              class="hidden"
            />
            <label :for="authTagId" class="text-sm font-semibold">
              Auth Tag
            </label>
            <UInput
              :id="authTagId"
              class="w-full"
              icon="i-heroicons-tag"
              type="text"
              color="purple"
              placeholder="Auth Tag"
              v-model="authTag"
              autocomplete="new-password"
            />

            <label :for="authTagId" class="text-xs opacity-70">
              Found in the HTTP header of the webhook request.
            </label>
          </div>

          <!-- wrapper: HTTP body -->
          <div class="flex flex-col gap-1">
            <input
              type="text"
              autocomplete="username"
              name="dummy_username"
              class="hidden"
            />
            <label :for="httpBodyId" class="text-sm font-semibold">
              HTTP Body
            </label>
            <UInput
              :id="httpBodyId"
              class="w-full"
              icon="i-heroicons-tag"
              type="text"
              color="purple"
              placeholder="HTTP Body"
              v-model="httpBody"
              autocomplete="new-password"
            />

            <label :for="httpBodyId" class="text-xs opacity-70">
              The encrypted body of the HTTP request.
            </label>
          </div>

          <UButton
            icon="i-heroicons-code-bracket-square"
            color="purple"
            label="Decrypt Data"
            @click="submitData"
          />
        </div>

        <!-- response -->
        <div class="w-1/2">
          <UTextarea
            :id="serverResponseId"
            class="font-mono"
            spellcheck="false"
            :rows="25"
            color="purple"
            v-model="serverResponse"
            readonly
            v-if="serverResponse"
          />
        </div>
      </div>
    </div>
  </div>
</template>
