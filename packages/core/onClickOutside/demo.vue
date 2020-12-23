<script setup lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { onClickOutside } from '.'

const modal = ref(false)
      const modalRef = ref(null)

      onClickOutside(
        modalRef,
        (event) => {
          console.log(event)
          modal.value = false
        },
        { window: jointWindow },
      )

      const dropdown = ref(false)
      const dropdownRef = ref(null)

      onClickOutside(
        dropdownRef,
        (event) => {
          console.log(event)
          dropdown.value = false
        },
        { window: jointWindow },
      )

      const ...styles,
        modal,
        modalRef,
        dropdown,
        dropdownRef,
</script>

<template>
  <div>
    <button @click="modal = true">Open Modal</button>
    <div class="relative" style="display: inline-block">
      <button @click="dropdown = true">Open Dropdown</button>
      <div v-if="dropdown" :style="dropdown_inner" ref="dropdownRef">
        Click outside of the dropdown to close it.
      </div>
    </div>
    <div v-if="modal" ref="modalRef" :style="wrapper">
      <div :style="inner">
        <button @click="modal = false" :style="button" title="Close modal">
          X
        </button>
        <p :style="heading">Demo Modal</p>
        <p>Click outside of the modal to close it.</p>
      </div>
    </div>
  </div>
</template>
