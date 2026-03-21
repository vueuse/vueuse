<script setup lang="ts">
import { useLiveAnnouncer } from '@vueuse/core'

const { polite, assertive, message } = useLiveAnnouncer()
</script>

<template>
  <div class="flex flex-col gap-4">
    <p>
      Click the buttons below to trigger screen reader announcements.
    </p>
    <div class="flex gap-2">
      <button @click="polite('The operation was successful.')">
        Announce Polite
      </button>
      <button @click="assertive('Error: something went wrong!')">
        Announce Assertive
      </button>
    </div>
    <p v-if="message" class="text-sm opacity-75">
      Last announcement: {{ message }}
    </p>
    <p class="text-sm opacity-50">
      Note: You need a screen reader active to hear the announcements.
    </p>
  </div>
</template>
