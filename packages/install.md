# Installation

> 🎩 VueUse works for Vue 2 & 3 **within a single package** by the power of [vue-demi](https://github.com/vueuse/vue-demi)!

```bash
npm i @vueuse/core
```

Vue 3 Demo: [Vite](https://github.com/vueuse/vueuse-vite-starter), [Webpack](https://github.com/vueuse/vueuse-vue3-example) / Vue 2 Demo: [Vue CLI](https://github.com/vueuse/vueuse-vue2-example)

> From v6.0, VueUse requires `vue` >= v3.2 or `@vue/composition-api` >= v1.1

### CDN

```html
<script src="https://unpkg.com/@vueuse/shared"></script>
<script src="https://unpkg.com/@vueuse/core"></script>
```

It will be exposed to global as `window.VueUse`

### Nuxt

From v6.7.0, we shipped a Nuxt module to enable auto importing for Nuxt 3 and Nuxt Bridge.

```ts
// nuxt.config.js
export default {
  buildModules: [
    '@vueuse/core/nuxt'
  ]
}
```

And then use VueUse function anywhere in your Nuxt app. For example:

```html
<script setup lang="ts">
const { x, y } = useMouse()
</script>

<template>
  <div>pos: {{x}}, {{y}}</div>
</template>
```

