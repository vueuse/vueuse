# Get Started

<CourseLink href="https://vueschool.io/courses/vueuse-for-everyone?friend=vueuse">Learn VueUse with video</CourseLink>

VueUse is a collection of utility functions based on [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html). We assume you are already familiar with the basic ideas of [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html) before you continue.

## Installation

> From v12.0, VueUse no longer supports Vue 2. Please use v11.x for Vue 2 support.

```bash
npm i @vueuse/core
```

[Add ons](/add-ons.html) | [Nuxt Module](/guide/index.html#nuxt)

## CDN

```vue
<script src="https://unpkg.com/@vueuse/shared"></script>

<script src="https://unpkg.com/@vueuse/core"></script>
```

It will be exposed to global as `window.VueUse`

## Nuxt

VueUse ships a Nuxt module that enables auto-imports.

Install the vueuse module into your application using [@nuxt/cli](https://nuxt.com/docs/api/commands/module):

```bash
npx nuxt@latest module add vueuse
```

Or use npm:

```bash
npm i -D @vueuse/nuxt @vueuse/core
```

Then add it to the `modules` in your `nuxt.config.ts`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
  ],
})
```

And then use VueUse function anywhere in your Nuxt app. For example:

```vue twoslash
<script setup lang="ts">
// ---cut-start---
// Actually auto-imported, but here we need to tell TwoSlash about it
import { useMouse } from '@vueuse/core'
// ---cut-end---
const { x, y } = useMouse()
</script>

<template>
  <div>pos: {{ x }}, {{ y }}</div>
</template>
```

## Demos

- [Vite + Vue 3](https://github.com/vueuse/vueuse-vite-starter)
- [Nuxt 4 + Vue 3](https://github.com/antfu/vitesse-nuxt)
- [Webpack + Vue 3](https://github.com/vueuse/vueuse-vue3-example)

## Usage Example

Simply importing the functions you need from `@vueuse/core`

```vue twoslash
<script setup>
import { useLocalStorage, useMouse, usePreferredDark } from '@vueuse/core'

// tracks mouse position
const { x, y } = useMouse()

// is user prefers dark theme
const isDark = usePreferredDark()

// persist state in localStorage
const store = useLocalStorage(
  'my-storage',
  {
    name: 'Apple',
    color: 'red',
  },
)
</script>
```

Refer to [functions list](/functions) for more details.
