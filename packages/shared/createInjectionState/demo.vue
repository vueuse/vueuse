<script setup lang="ts">
import RootComponent from './demo/RootComponent.vue'
import CountComponent from './demo/CountComponent.vue'
import ButtonComponent from './demo/ButtonComponent.vue'
</script>

<template>
  <div>
    <RootComponent>
      <ButtonComponent />
      <CountComponent />
    </RootComponent>
  </div>
</template>
