<script setup lang="ts">
import { ref } from 'vue-demi'
import { useDialog } from '@vueuse/core'

interface DialogProperties {
  name: string
}

interface DialogResult {
  status: 'confirmed' | 'denied'
}

const { isRevealed, reveal, close, on, properties } = useDialog<DialogProperties, DialogResult>()
const status = ref<DialogResult>()
const name = ref<string>('')

on.reveal(({ data }) => console.log(data?.name))
on.close(({ data }) => console.log(data?.status))

async function show() {
  const { result } = await reveal({
    name: name.value,
  })

  status.value = result
}

function confirm() {
  close({ status: 'confirmed' })
}

function deny() {
  close({ status: 'denied' })
}
</script>

<template>
  <form
    class="flex flex-col mt-4 p-4 border border-main rounded"
    :class="{
      'opacity-40 pointer-events-none': isRevealed,
    }"
    @submit.prevent="show"
  >
    <span>Enter your name:</span>
    <input v-model="name" type="text">
    <div>
      <button :disabled="!name">
        Open
      </button>
    </div>
  </form>

  <div class="mt-4 p-4 border border-main rounded">
    Last result: {{ status ?? 'none' }}
  </div>

  <div v-if="isRevealed" class="mt-4 p-4 border border-main rounded">
    <span>Your name is:</span>
    <pre v-text="properties" />
    <button @click="confirm">
      Confirm
    </button>
    <button @click="deny">
      Deny
    </button>
  </div>
</template>
