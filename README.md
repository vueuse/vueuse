<p align="center">
<img src="https://raw.githubusercontent.com/antfu/vueuse/master/resources/logo-vertical.png" alt="logo" width="300"/>
</p>

<p align="center">
<a href="https://www.npmjs.com/package/@vueuse/core" target="__blank"><img src="https://img.shields.io/npm/v/@vueuse/core?color=a1b858" alt="NPM version" /></a>
<a href="https://vueuse.netlify.com" target="__blank"><img src="https://img.shields.io/static/v1?label=storybook&message=demos&color=63ba83" alt="Storybook Demos" /></a>
<a href="https://github.com/antfu/vueuse" target="__blank"><img src="https://img.shields.io/github/last-commit/antfu/vueuse.svg?color=a38eed" alt="GitHub last commit" /></a>
<a href="https://github.com/antfu/vueuse/issues" target="__blank"><img src="https://img.shields.io/github/issues/antfu/vueuse.svg?color=c977be" alt="GitHub issues" /></a>
<a href="https://github.com/antfu/vueuse" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/antfu/vueuse?style=social"></a>
</p>

<p align="center">
Collection of essential Vue Composition API (inspired by <a href='https://github.com/streamich/react-use' target='__blank'>react-use</a>)
</p>

> 🚧 Working in progress...

## 🚀 Features

- 0 dependencies ⚡ No worry about your bundle size
- Fully tree shakable 🌴 Only take what you want
- Seamless migration 🕶 Use it now! Work for **both** Vue 3.x and 2.x
- Browser compatible 🌐 No need to setup build tools
- Intractive demos 🎪 [Check our Storybook!](https://vueuse.netlify.com)

## 📦 Install

### for Vue 3.x ([vue-next](https://github.com/vuejs/vue-next))

```bash
npm i @vueuse/core@next
```

### for Vue 2.x with [composition-api](https://github.com/vuejs/composition-api) polyfill


```bash
npm i @vue/composition-api
npm i @vueuse/core
```

Please [register the Composition API Plugin](https://github.com/vuejs/composition-api#usage) before other using APIs.

### CDN

```html
<!-- For Vue 3.x -->
<script src="https://unpkg.com/@vueuse/core@next"></script> 

<!-- For Vue 2.x -->
<script src="https://unpkg.com/@vueuse/core"></script>
```

It will be exposed to global variable `window.VueUse`

## ⚡ Functions

You can checkout the documents and live demos in [Storybook](https://vueuse.netlify.com/).

- useCounter
- useIntervalFn
- useStorage
- useStoragePlain
- useNow
- useRaf
- useTimeout
- useTimeoutFn
- useWindowScroll
- useWindowSize

More functions to be added. Please keep turned. (PRs are also welcome!)

## 📄 License

[MIT License](https://github.com/antfu/vueuse/blob/master/LICENSE) © 2019-2020 [Anthony Fu](https://github.com/antfu)
