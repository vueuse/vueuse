import type { Plugin } from 'vite'

// Due to https://github.com/vuejs/theme/commit/842e4451fbf13925d1c67aa4274f86fc5a8510f7
export function NavbarFix(): Plugin {
  return {
    name: 'navbar-fix',
    enforce: 'pre',
    transform(code, id) {
      if (id.includes('VPNavBarTitle.vue') && !id.endsWith('.css')) {
        return `
<template>
  <a class="VPNavBarTitle" href="/">
    <img src="/favicon.svg" alt="VueUse" class="logo" style="width: 24px;"/>
    <span class="text">VueUse</span>
  </a>
</template>

<style scoped>
.VPNavBarTitle {
  display: flex;
  align-items: center;
  padding-top: 1px;
  height: var(--vt-nav-height);
  transition: opacity 0.25s;
}
.VPNavBarTitle:hover {
  opacity: 0.6;
}
.logo {
  position: relative;
}
.logo + .text {
  padding-left: 8px;
}
.text {
  font-size: 16px;
  font-weight: 500;
}
</style>
      `
      }
    },
  }
}
