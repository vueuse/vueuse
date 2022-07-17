<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()

const close = async () => {
  offlineReady.value = false
  needRefresh.value = false
}
</script>

<template>
  <div
    v-if="needRefresh"
    class="pwa-toast bg-$vp-c-bg border border-$vp-c-divider fixed right-0 bottom-0 m-6 px-6 py-4 rounded shadow-xl"
    role="alert"
  >
    <div class="mb-3">
      New content available, click the reload button to update.
    </div>
    <button
      v-if="needRefresh"
      class="border border-$vp-c-divider bg-$vp-c-brand text-white mr-2 px-3 py-1 rounded hover:bg-$vp-c-brand-dark"
      @click="updateServiceWorker()"
    >
      Reload
    </button>
    <button
      class="border border-$vp-c-divider bg-$vp-c-brand text-white mr-2 px-3 py-1 rounded hover:bg-$vp-c-brand-dark"
      @click="close"
    >
      Close
    </button>
  </div>
</template>
