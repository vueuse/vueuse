<script setup lang="ts">
import { computed, ref, shallowReadonly } from 'vue-demi'
import { useChangeCase } from '.'
import type { ChangeCaseType } from '.'
const arr: Array<ChangeCaseType> = [
  'camelCase',
  'capitalCase',
  'constantCase',
  'dotCase',
  'headerCase',
  'noCase',
  'paramCase',
  'pascalCase',
  'pathCase',
  'sentenceCase',
  'snakeCase',
]
const types = shallowReadonly(arr)
const input = ref('helloWorld')
const type = ref<ChangeCaseType>(arr[0])
const changeCase = computed(() => {
  return useChangeCase(input, type.value)
})
</script>

<template>
  <div>
    <label v-for="item in types" :key="item" class="radio">
      <input v-model="type" :value="item" type="radio">
      <span>{{ item }}</span>
    </label>
  </div>
  <input v-model="input" type="text">
  <pre lang="yaml">{{ changeCase }}</pre>
</template>

<style scoped>
</style>

<style scoped lang="postcss">
input {
  --tw-ring-offset-width: 1px !important;
  --tw-ring-color: #8885 !important;
  --tw-ring-offset-color: transparent !important;
}

.radio {
  width: 7rem;
  @apply ml-2;
  @apply inline-flex items-center my-auto cursor-pointer select-none;
}

.radio input {
  appearance: none;
  padding: 0;
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
  display: inline-block;
  vertical-align: middle;
  background-origin: border-box;
  user-select: none;
  flex-shrink: 0;
  height: 1rem;
  width: 1rem;
  @apply bg-gray-400/30;
  @apply rounded-full h-4 w-4 select-none relative;
  @apply mr-1;
}

.radio input:checked::after {
  content: "";
  @apply absolute inset-[3px] rounded-full bg-primary;
}

.checkbox span {
  @apply ml-1.5 text-13px opacity-70;
}
</style>
