# @vueuse/nuxt

[![NPM version](https://img.shields.io/npm/v/@vueuse/nuxt?color=a1b858)](https://www.npmjs.com/package/@vueuse/nuxt)

> This is an add-on of [VueUse](https://github.com/vueuse/vueuse), which provides better Nuxt integration auto-import capabilities.

## Install

Install the vueuse module into your application using [@nuxt/cli](https://nuxt.com/docs/api/commands/module):

```bash
npx nuxt@latest module add vueuse
```

Or use npm:

```bash
npm i @vueuse/nuxt @vueuse/core
```

```ts
// nuxt.config
export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
  ],
})
```

## Caveats

The following utils are **disabled** from auto-import for Nuxt to avoid conflicts with Nuxt's built-in utils:

- `toRef`
- `toRefs`
- `toValue`
- `useFetch`
- `useCookie`
- `useHead`
- `useTitle`
- `useStorage`
- `useImage`

You can always use them by explicitly importing from `@vueuse/core`

## License

[MIT License](https://github.com/vueuse/vueuse/blob/master/LICENSE) © 2021-PRESENT [Anthony Fu](https://github.com/antfu)
