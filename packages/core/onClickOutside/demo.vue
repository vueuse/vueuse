<script setup lang="ts">
import { ref } from 'vue-demi'
import { onClickOutside } from '.'

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
const dropdownRef = ref(null)

onClickOutside(
  dropdownRef,
  (event) => {
    console.log(event)
    dropdown.value = false
  },
)
</script>

<template>
  <div>
    <button @click="modal = true">
      Open Modal
    </button>
    <div class="relative inline-block ml-2">
      <button @click="dropdown = true">
        Open Dropdown
      </button>
      <div v-if="dropdown" ref="dropdownRef" class="dropdown-inner">
        Click outside of the dropdown to close it.
      </div>
    </div>
    <div v-if="modal" ref="modalRef" class="wrapper">
      <div class="inner">
        <button class="button" title="Close modal" @click="modal = false">
          X
        </button>
        <p class="heading">
          Demo Modal
        </p>
        <p>Click outside of the modal to close it.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 420px;
  max-width: 100%;
}
.inner {
  background-color: #4d4d4d;
  padding: 1.2em;
}
.dropdown-inner {
  background-color: #4d4d4d;
  padding: 1.2em;
  position: absolute;
  left: 0;
}
.heading {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}
.button {
  position: absolute;
  top: -1rem;
  right: -1rem;
  font-weight: bold;
}
</style>
