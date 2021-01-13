<script lang="ts">
import { ref, watch, defineComponent } from 'vue-demi'
import { templateRef } from '.'

export default defineComponent({
  setup() {
    const text = ref<string>('')
    const $message = templateRef<Element | null>('message', null)
    const visible = ref(true)

    const handleToggle = () => {
      visible.value = !visible.value
    }

    watch($message, (_$message) => {
      text.value = _$message?.textContent?.trim() ?? ''
    }, { flush: 'post' })

    return {
      text,
      visible,
      handleToggle,
    }
  },
})

</script>

<template>
  <div v-if="visible" ref="message" style="display: none;">
    Hello World
  </div>
  <div>
    Hidden div tags content is: {{ text }}
  </div>
  <button @click="handleToggle">
    {{ visible ? 'Delete Element' : 'Add Element' }}
  </button>
</template>
