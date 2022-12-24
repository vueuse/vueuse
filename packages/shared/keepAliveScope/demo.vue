<script setup lang="ts">
import { computed, ref } from 'vue'
import FirstComponent from './demo/FirstComponent.vue'
import SecondComponent from './demo/SecondComponent.vue'

const showFirstComponent = ref(true)

const component = computed(() => showFirstComponent.value ? FirstComponent : SecondComponent)
</script>

<template>
  <div>
    <p>We used keepAliveScope in second component.</p>
    <p>The move event will be disabled on the second component, but not on the first component</p>
    <div grid grid-cols-2>
      <label>
        <input v-model="showFirstComponent" type="checkbox">
        Show first component
      </label>
      <KeepAlive>
        <component :is="component" />
      </KeepAlive>
    </div>
  </div>
</template>
