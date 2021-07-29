<script setup lang="ts">
import { ref } from 'vue-demi'
import { useEventBus } from '.'

const { on, emit } = useEventBus<string>('vue-use-event-bus')
const message = ref('')
on(_message => message.value = _message)
</script>

<template>
  <div style="display: flex; gap: 100px;">
    <div>
      <div>news channel:</div>
      <button @click="emit('The Tokyo Olympics has begun')">
        Broadcast news
      </button>
    </div>
    <div>
      <div style="margin-bottom: 13px;">
        television:
      </div>
      <div>{{ message || '---' }}</div>
    </div>
  </div>
</template>
