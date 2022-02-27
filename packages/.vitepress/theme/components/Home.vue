<template>
  <main class="home" aria-labelledby="main-title">
    <HomeHero :count="props.functionsCount" />
    <slot name="hero" />
    <HomeFeatures />
    <slot name="features" />
    <HomeFooter />
    <slot name="footer" />
  </main>
</template>

<script setup lang="ts">
import HomeHero from './HomeHero.vue'
import HomeFeatures from './HomeFeatures.vue'
import HomeFooter from './HomeFooter.vue'
const props = defineProps({
  functionsCount: {
    type: Number,
  },
})
</script>

<style scoped>
.home {
  padding-top: var(--header-height);
}
</style>
