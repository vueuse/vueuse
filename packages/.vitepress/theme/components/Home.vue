<script setup lang="ts">
import HomeHero from './HomeHero.vue'
import HomeFeatures from './HomeFeatures.vue'
import HomeFooter from './HomeFooter.vue'
</script>

<template>
  <main class="home" aria-labelledby="main-title" flex flex-col items-center>
    <HomeHero />
    <slot name="hero" />
    <HomeFeatures />
    <slot name="features" />

    <HomeTeam />

    <HomeContributors />

    <HomeSponsors />

    <HomeFooter />
    <slot name="footer" />
  </main>
</template>

<style scoped>
.home {
  padding-top: var(--header-height);
}
</style>
