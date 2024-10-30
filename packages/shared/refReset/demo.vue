<script setup lang="ts">
import { refReset } from '@vueuse/core'

const form = refReset(() => ({ name: '' }))

function setName() {
  form.value.name = 'Hulk'
}

function resetForm() {
  form.reset()
}
</script>

<template>
  <div>
    <button @click="resetForm">
      Reset Form
    </button>
    <button @click="setName">
      Set Name
    </button>
    <pre>{{ form }}</pre>
  </div>
</template>
