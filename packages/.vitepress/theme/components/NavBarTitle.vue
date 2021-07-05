<script setup lang="ts">
import { withBase, useData } from 'vitepress'
const { site, theme, localePath } = useData()
</script>

<template>
  <a
    class="nav-bar-title"
    :href="localePath"
    :aria-label="`${site.title}, back to home`"
  >
    <img
      v-if="theme.logo"
      class="logo"
      :src="withBase(theme.logo)"
      alt="Logo"
    />
    {{ site.title }}
  </a>
</template>

<style scoped>
.nav-bar-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--c-text);
}

.nav-bar-title:hover {
  text-decoration: none;
}

.logo {
  margin-right: 0.75rem;
  height: 1.3rem;
  vertical-align: bottom;
}
</style>
