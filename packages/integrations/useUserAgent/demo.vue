<script setup lang='ts'>
import { computed, ref, watch } from 'vue'
import { useUserAgent } from '.'

const ua = useUserAgent(navigator.userAgent)
</script>

<template>
  <pre>{{ ua.getResult() }}</pre>
</template>

<style scoped lang="postcss">
input {
  --tw-ring-offset-width: 1px !important;
  --tw-ring-color: #8885 !important;
  --tw-ring-offset-color: transparent !important;
}

.checkbox {
  @apply inline-flex items-center my-auto cursor-pointer select-none;
}

.checkbox input {
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
  @apply rounded-md h-4 w-4 select-none;
}

.checkbox input:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
}

.checkbox span {
  @apply ml-1.5 text-13px opacity-70;
}
</style>
