<script setup lang="ts">
import { useBeforeUnload } from '@vueuse/core'
import { computed, shallowRef } from 'vue'

// Basic usage
const basicEnabled = shallowRef(true)
function toggleBasic() {
  basicEnabled.value = !basicEnabled.value
}
useBeforeUnload(basicEnabled, 'Are you sure you want to leave?')

// Custom message
const customEnabled = shallowRef(false)
const customMessage = shallowRef('You have unsaved changes!')
function toggleCustom() {
  customEnabled.value = !customEnabled.value
}
useBeforeUnload(customEnabled, customMessage)

// Conditional protection
const formContent = shallowRef('')
const hasUnsavedChanges = computed(() => formContent.value.trim().length > 0)
useBeforeUnload(hasUnsavedChanges, 'You have unsaved changes. Are you sure you want to leave?')

// Function overload
const functionOverloadEnabled = shallowRef(false)
function toggleFunctionOverload() {
  functionOverloadEnabled.value = !functionOverloadEnabled.value
}
useBeforeUnload(functionOverloadEnabled, 'Function overload protection is active!')
</script>

<template>
  <div class="max-w-4xl font-sans">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">
      useBeforeUnload Demo
    </h2>

    <div class="mb-8 border border-gray-200 rounded-lg bg-gray-50">
      <h3 class="text-lg font-semibold text-gray-700 border-b-2 border-blue-500 pb-2 mb-3">
        Basic Usage
      </h3>
      <p class="text-gray-600 mb-3">
        Try to close this tab or navigate away - you'll see a confirmation dialog.
      </p>
      <button
        class="px-5 py-2.5 rounded text-white font-medium transition-colors duration-200" :class="[
          basicEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600',
        ]"
        @click="toggleBasic"
      >
        {{ basicEnabled ? 'Disable' : 'Enable' }} Basic Protection
      </button>
    </div>

    <div class="mb-8 border border-gray-200 rounded-lg bg-gray-50">
      <h3 class="text-lg font-semibold text-gray-700 border-b-2 border-blue-500 pb-2 mb-3">
        Dynamic Message
      </h3>
      <input
        v-model="customMessage"
        placeholder="Enter custom message..."
        class="w-full px-3 py-2 border border-gray-300 rounded mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
      <button
        class="px-5 py-2.5 rounded text-white font-medium transition-colors duration-200" :class="[
          customEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600',
        ]"
        @click="toggleCustom"
      >
        {{ customEnabled ? 'Disable' : 'Enable' }} Custom Message
      </button>
    </div>

    <div class="mb-8 border border-gray-200 rounded-lg bg-gray-50">
      <h3 class="text-lg font-semibold text-gray-700 border-b-2 border-blue-500 pb-2 mb-3">
        Conditional Protection
      </h3>
      <div>
        <textarea
          v-model="formContent"
          placeholder="Type something to enable protection..."
          class="w-full min-h-24 p-3 border border-gray-300 rounded text-sm font-inherit resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p class="mt-3 font-medium">
          Status:
          <span
            class="px-2 py-1 rounded text-xs font-bold uppercase" :class="[
              hasUnsavedChanges ? 'bg-green-500 text-white' : 'bg-gray-500 text-white',
            ]"
          >
            {{ hasUnsavedChanges ? 'Protected' : 'Not Protected' }}
          </span>
        </p>
      </div>
    </div>

    <div class="mb-8 border border-gray-200 rounded-lg bg-gray-50">
      <h3 class="text-lg font-semibold text-gray-700 border-b-2 border-blue-500 pb-2 mb-3">
        Function Overload
      </h3>
      <button
        class="px-5 py-2.5 rounded text-white font-medium transition-colors duration-200" :class="[
          functionOverloadEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600',
        ]"
        @click="toggleFunctionOverload"
      >
        {{ functionOverloadEnabled ? 'Disable' : 'Enable' }} Function Overload
      </button>
    </div>
  </div>
</template>
