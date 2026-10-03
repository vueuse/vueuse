<script setup lang="ts">
import { useLiveAnnouncer } from '@vueuse/core'

const { announce, polite, assertive } = useLiveAnnouncer()

function handleAnnounce() {
  announce('Announcement using the base announce function.')
}

function handlePolite() {
  polite('Polite announcement: The operation was successful.')
}

function handleAssertive() {
  assertive('Assertive announcement: An error occurred!')
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <p>
      Click the buttons below to trigger screen reader announcements.
    </p>
    <div class="flex gap-2">
      <button @click="handleAnnounce">
        Use Announce Custom
      </button>
      <button @click="handlePolite">
        Announce Polite
      </button>
      <button @click="handleAssertive">
        Announce Assertive
      </button>
    </div>
    <p class="text-sm opacity-50">
      Note: You need a screen reader active to hear the announcements.
    </p>
  </div>
</template>
