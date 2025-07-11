<script setup lang="ts">
import { useMounted } from '@vueuse/core'
import { defineComponent, h, shallowRef } from 'vue'

// Default usage - monitors current component's mount state
const isMounted = useMounted()

const customComponent = defineComponent({

  render() {
    return h('div', {
      class: 'h-15 bg-gray-500/5 rounded p-3',
    }, [
      h('p', 'This is the target component being monitored!'),
    ])
  },
})

const customComponentRef = shallowRef<InstanceType<typeof customComponent>>()

const isTargetMounted = useMounted(customComponentRef)

// Toggle visibility of target component
const showTarget = shallowRef(false)

function toggleTarget() {
  showTarget.value = !showTarget.value
}
</script>

<template>
  <div>
    <h3>Default Usage</h3>
    <p>Current component: {{ isMounted ? 'mounted' : 'unmounted' }}</p>

    <h3>With Target Parameter</h3>
    <p>Target component: {{ isTargetMounted ? 'mounted' : 'unmounted' }}</p>
    <button @click="toggleTarget">
      {{ showTarget ? 'Hide' : 'Show' }} Target Component
    </button>

    <custom-component v-if="showTarget" ref="customComponentRef" />
  </div>
</template>
