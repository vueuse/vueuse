# @vueuse/reactified

[![NPM version](https://img.shields.io/npm/v/@vueuse/reactified?color=a1b858)](https://www.npmjs.com/package/@vueuse/reactified)

> This is an add-on of [VueUse](https://github.com/antfu/vueuse), provides reactified built-in functions & utilities.

## 📦 Install

<pre class='language-bash'>
npm i <b>@vueuse/reactified</b>
</pre>

## ⚡ Usage

```ts
import { Math, JSON, console } from '@vueuse/reactified'

const { pow, sum, sqrt } = Math

//          _________
// for c = √ a² + b²
const a = ref(3)
const b = ref(4)
const c = sqrt(sum(pow(a, 2), pow(b, 2))) // 5

console.log(c) // no need for `.value`, and will log on changing
```

## 📄 License

[MIT License](https://github.com/antfu/vueuse/blob/master/LICENSE) © 2019-PRESENT [Anthony Fu](https://github.com/antfu)
