<script setup lang="ts">
import { createTemplatePromise } from '.'

type DialogResult = 'ok' | 'cancel'

const TemplatePromise = createTemplatePromise<DialogResult, [string]>({
  transition: {
    name: 'fade',
    appear: true,
  },
})

async function open(idx: number) {
  console.log(idx, 'Before')
  const result = await TemplatePromise.start(`Hello ${idx}`)
  console.log(idx, 'After', result)
}

function asyncFn() {
  return new Promise<DialogResult>((resolve) => {
    setTimeout(() => {
      resolve('ok')
    }, 1000)
  })
}
</script>

<template>
  <div class="flex gap-2">
    <button @click="open(1)">
      Open 1
    </button>
    <button @click="open(2)">
      Open 2
    </button>
    <button @click="open(1); open(2)">
      Open 1 & 2
    </button>
  </div>
  <TemplatePromise v-slot="{ resolve, args, isResolving }">
    <div class="fixed inset-0 bg-black/10 flex items-center z-30">
      <dialog open class="border-gray/10 shadow rounded ma">
        <div>Dialog {{ args[0] }}</div>
        <p>Open console to see logs</p>
        <div class="flex gap-2 justify-end">
          <button class="w-35" @click="resolve('cancel')">
            Cancel
          </button>
          <button class="w-35" :disabled="isResolving" @click="resolve(asyncFn())">
            {{ isResolving ? 'Confirming...' : 'OK' }}
          </button>
        </div>
      </dialog>
    </div>
  </TemplatePromise>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
