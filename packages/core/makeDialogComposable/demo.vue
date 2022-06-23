<script setup lang="ts">
import { reactive, ref } from 'vue-demi'
import { useLoginDialog } from './dialogs'
import type { LoginFormResult } from './dialogs'

const { reveal, close, properties, isRevealed, on } = useLoginDialog()

const error = ref<string>()
const result = ref<LoginFormResult>()
const form = reactive({
  email: properties.value?.email,
  password: '',
})

on.reveal(({ data }) => {
  form.email = data?.email
  form.password = ''
})

async function login() {
  result.value = undefined
  error.value = undefined

  const { result: user } = await reveal({ email: 'jon@doe.dev' })
  result.value = user
}

function submit() {
  if (!form.email || !form.password) {
    error.value = 'Please fill the missing fields.'
    return
  }

  close({
    email: form.email!,
    password: form.password,
  })
}
</script>

<template>
  <div class="mt-4 p-4 border border-main rounded">
    <button @click="login">
      Log in
    </button>
  </div>

  <form v-if="isRevealed" class="mt-4 p-4 border border-main rounded" @submit.prevent="submit">
    <div>
      <span>Email:</span>
      <input v-model="form.email" type="email">
    </div>
    <div>
      <span>Password:</span>
      <input v-model="form.password" type="password">
    </div>
    <button>Log in</button>
    <span v-if="error" class="text-red-400 ml-4" v-text="error" />
  </form>

  <div v-if="result" class="mt-4 p-4 border border-main rounded">
    Result:
    <pre v-text="result" />
  </div>
</template>
