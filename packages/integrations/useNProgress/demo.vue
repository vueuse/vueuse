<script setup lang="ts">
import './style.css'
import { defineComponent } from 'vue-demi'
import { useNProgress } from '.'

const { isLoading } = useNProgress()
</script>

<template>
  <note class="mb-2">
    Click to change progress status
  </note>
  <button :class="isLoding ? 'orange': ''" @click="isLoading = !isLoading">
    {{ !isLoading ? 'Start' : 'Stop' }}
  </button>
</template>
