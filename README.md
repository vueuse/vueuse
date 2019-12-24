<p align="center">
<img src="./screenshots/logo.png" alt="logo" width="300"/>
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

## 📦 Install

We supports both Vue 3.x and Vue 2.x, you can seamlessly upgrade it when you migrate from Vue 2.x to 3.x.

### Vue 3.x ([vue-next](https://github.com/vuejs/vue-next))

```bash
npm install @vueuse/core@next
```

### Vue 2.x with [composition-api](https://github.com/vuejs/composition-api) polyfill


```bash
npm install @vue/composition-api
npm install @vueuse/core@2
```

Install the polyfill before other APIs

```js
import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';

Vue.use(VueCompositionApi);
```

## ⚡ Functions

You can checkout the documents and live demos in [Storybook](https://vueuse.netlify.com/).

- useNow
- useCounter
- useRaf
- useTimeout
- useTimeoutFn

More functions to be added. Please keep turned.

## 📄 License

[MIT License](https://github.com/antfu/vueuse/blob/master/LICENSE) © 2019-2020 [Anthony Fu](https://github.com/antfu)
