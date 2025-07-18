<script setup lang="ts">
import { useFocusTrap } from '@vueuse/integrations'
import { shallowRef, useTemplateRef } from 'vue'

const target = useTemplateRef<HTMLElement>('target')
const target2 = useTemplateRef<HTMLElement>('target2')
const targets = shallowRef<HTMLElement | null>(null)

const { hasFocus, activate, deactivate } = useFocusTrap(targets)

function focusTopForm() {
  targets.value = target.value
}

function focusBottomForm() {
  targets.value = target2.value
}
</script>

<template>
  <div class="flex flex-col items-center">
    <button @click="activate()">
      {{ hasFocus ? 'Focus is trapped within form' : 'Trap focus within form' }}
    </button>
    <input
      type="text"
      :placeholder="hasFocus ? 'You can\'t focus me' : 'You can focus me'"
    >

    <div
      ref="target"
      class="shadow-lg bg-gray-600 bg-opacity-10 dark:(bg-gray-400 bg-opacity-10) rounded max-w-96 mx-auto p-8"
    >
      <div class="flex flex-row items-center text-6xl text-center justify-center">
        <twemoji:face-with-monocle v-if="hasFocus" />
        <twemoji:sleeping-face v-else />
      </div>
      <input type="text" class="!w-12" placeholder="Email">
      <input type="text" placeholder="Nickname">
      <input placeholder="Password" type="text">
      <div class="flex flex-row justify-center">
        <button @click="deactivate()">
          Free Focus
        </button>
        <button @click="focusBottomForm">
          Focus Bottom Form
        </button>
      </div>
    </div>

    <div
      ref="target2"
      class="shadow-lg bg-green-100 rounded max-w-96 mx-auto p-8"
    >
      <h3 class="text-center mb-4">
        Container 2
      </h3>
      <input type="text" placeholder="First Name" class="block w-full mb-2">
      <input type="text" placeholder="Last Name" class="block w-full mb-2">
      <textarea placeholder="Comments" class="block w-full mb-4" />
      <div class="flex gap-2 justify-center">
        <button @click="deactivate()">
          Free Focus
        </button>
        <button @click="focusTopForm">
          Focus Top Form
        </button>
      </div>
    </div>
  </div>
</template>
