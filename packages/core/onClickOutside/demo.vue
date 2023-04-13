<script setup lang="ts">
import { ref } from 'vue'
import type { OnClickOutsideHandler } from '@vueuse/core'
import { onClickOutside } from '@vueuse/core'
import { vOnClickOutside } from './directive'

const modal = ref(false)
const modalRef = ref(null)

onClickOutside(
  modalRef,
  (event) => {
    console.log(event)
    modal.value = false
  },
)

const dropdown = ref(false)
const dropdownHandler: OnClickOutsideHandler = (event) => {
  console.log(event)
  dropdown.value = false
}
</script>

<template>
  <button @click="modal = true">
    Open Modal
  </button>
  <div class="ml-2 relative inline-block">
    <button @click.stop="dropdown = !dropdown">
      Toggle Dropdown
    </button>
    <div
      v-if="dropdown"
      v-on-click-outside.bubble="dropdownHandler"
      class="dropdown-inner"
    >
      Click outside of the dropdown to close it.
    </div>
  </div>
  <div v-if="modal" ref="modalRef" class="modal">
    <div class="inner">
      <button class="button small" title="Close" @click="modal = false">
        𝖷
      </button>
      <p class="heading">
        Demo Modal
      </p>
      <p>Click outside of the modal to close it.</p>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 420px;
  max-width: 100%;
  z-index: 10;
}
.inner {
  background-color: var(--vp-c-bg);
  padding: 0.4em 2em;
  border-radius: 5px;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 2px 2px 10px rgba(10, 10, 10, 0.1);
}
.dropdown-inner {
  background-color: var(--vp-c-bg);
  padding: 0.5em;
  position: absolute;
  left: 0;
  z-index: 10;
  border-radius: 5px;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 2px 2px 5px rgba(10, 10, 10, 0.1);
}
.heading {
  font-weight: bold;
  font-size: 1.4rem;
  margin-bottom: 2rem;
}
.button {
  position: absolute;
  top: -0.9rem;
  right: -0.5rem;
  font-weight: bold;
}
</style>
