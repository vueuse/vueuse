<script setup lang="ts">
import ButtonComponent from './demo/ButtonComponent.vue'
import CountComponent from './demo/CountComponent.vue'
import RootComponent from './demo/RootComponent.vue'
</script>

<template>
  <div>
    <RootComponent>
      <ButtonComponent />
      <CountComponent />
    </RootComponent>
  </div>
</template>
