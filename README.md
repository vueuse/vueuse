<p align="center">
<a href="https://github.com/antfu/vueuse"><img src="https://raw.githubusercontent.com/antfu/vueuse/master/resources/logo-vertical.png" alt="VueUse - Collection of essential Vue Composition Utilities" width="300"></a><br>
Collection of essential Vue Composition Utilities
</p>

<p align="center">
<a href="https://www.npmjs.com/package/@vueuse/core" target="__blank"><img src="https://img.shields.io/npm/v/@vueuse/core?color=a1b858&label=" alt="NPM version"></a>&nbsp;
<a href="https://www.npmjs.com/package/@vueuse/core" target="__blank"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@vueuse/core?color=50a36f&label="></a>&nbsp;
<a href="https://vueuse.js.org" target="__blank"><img src="https://img.shields.io/static/v1?label=&message=docs%20%26%20demos&color=1e8a7a" alt="Docs & Demos"></a>&nbsp;
<img alt="Function Count" src="https://img.shields.io/badge/-96%20functions-13708a">
<br>
<a href="https://github.com/antfu/vueuse" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/antfu/vueuse?style=social"></a>
</p>

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'>
  </a>
</p>


## 🚀 Features

- ⚡ **Fully tree shakable**: Only take what you want, [bundle size](./docs/Export-Size.md)
- 🦾 **Type Strong**: Written in [Typescript](https://www.typescriptlang.org/), with [TS Docs](https://github.com/microsoft/tsdoc)
- 🕶 **Seamless migration**: Works for **both** Vue 3 and 2
- 🔩 **Flexible**: Configurable event filters
- 🌎 **No bundler required**: Usable via CDN
- 🔋 **SSR Friendly**
- 🎪 **Interactive docs & demos**: [Check out the Storybook!](https://vueuse.js.org)
- 🔌 **Optional [Add-ons](#-add-ons)**: Router, Firebase, RxJS, etc.

## 🦄 Usage

```ts
import { useMouse, usePreferredDark, useLocalStorage } from '@vueuse/core'

export default {
  setup() {
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

    return { x, y, isDark, store }
  }
})
```

Refer to [functions list](https://vueuse.js.org/functions) or [documentations](https://vueuse.js.org/) for more details.

## 📦 Install

> 🎩 From v4.0, it works for Vue 2 & 3 **within a single package** by the power of [vue-demi](https://github.com/antfu/vue-demi)!

```bash
npm i @vueuse/core
```

Vue 3 Demo: [Vite](https://github.com/antfu/vite-vueuse-starter), [Webpack](https://github.com/antfu/vueuse-next-example) / Vue 2 Demo: [Vue CLI](https://github.com/antfu/vueuse-vue2-example)

### CDN

```html
<script src="https://unpkg.com/@vueuse/core"></script>
```

It will be exposed to global as `window.VueUse`

## 🧱 Contribute

See the [**Contributing Guide**](https://vueuse.js.org/contributing)

## 🌸 Thanks

This project is heavily inspired by the following awesome projects.

- [streamich/react-use](https://github.com/streamich/react-use)
- [u3u/vue-hooks](https://github.com/u3u/vue-hooks)
- [shuidi-fed/vue-composition-toolkit](https://github.com/shuidi-fed/vue-composition-toolkit)
- [logaretm/vue-use-web](https://github.com/logaretm/vue-use-web)
- [kripod/react-hooks](https://github.com/kripod/react-hooks)

Thanks!


## 👨‍🚀 Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [How to Contribute](https://vueuse.js.org/?path=/story/docs--contributing).

<a href="https://github.com/antfu/vueuse/graphs/contributors"><img src="https://opencollective.com/vueuse/contributors.svg?width=890&button=false" ></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [Contribute via Open Collective](https://opencollective.com/vueuse/contribute)

#### Individuals

<a href="https://opencollective.com/vueuse"><img src="https://opencollective.com/vueuse/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/vueuse/contribute)]

<a href="https://opencollective.com/vueuse/organization/0/website"><img src="https://opencollective.com/vueuse/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/vueuse/organization/1/website"><img src="https://opencollective.com/vueuse/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/vueuse/organization/2/website"><img src="https://opencollective.com/vueuse/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/vueuse/organization/3/website"><img src="https://opencollective.com/vueuse/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/vueuse/organization/4/website"><img src="https://opencollective.com/vueuse/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/vueuse/organization/5/website"><img src="https://opencollective.com/vueuse/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/vueuse/organization/6/website"><img src="https://opencollective.com/vueuse/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/vueuse/organization/7/website"><img src="https://opencollective.com/vueuse/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/vueuse/organization/8/website"><img src="https://opencollective.com/vueuse/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/vueuse/organization/9/website"><img src="https://opencollective.com/vueuse/organization/9/avatar.svg"></a>

## 📄 License

[MIT License](https://github.com/antfu/vueuse/blob/master/LICENSE) © 2019-PRESENT [Anthony Fu](https://github.com/antfu)
