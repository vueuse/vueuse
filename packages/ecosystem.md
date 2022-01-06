# Ecosystem

While developing VueUse, we extract the tools we are using into separate projects that can be used standalone from time to time.

<h2 align="center">
<a href="https://github.com/vueuse/vue-demi" target="_blank">
<img src="https://github.com/vueuse/vue-demi/raw/master/assets/banner.png" alt="vue-demi" width="500"/>
</a>
</h2>

Vue Demi is a tool for library authors to create composable libraries that work for Vue 2 and 3 isomorphically just like VueUse. It has been widely adopted by many popular libraries like [`vuelidate`](https://github.com/vuelidate/vuelidate) and [`vue-promised`](https://github.com/posva/vue-promised).

<h2 align="center">
<a href="https://github.com/vueuse/vue-chemistry" target="_blank">
<img src="https://github.com/vueuse/vue-chemistry/raw/main/res/hero.png" alt="vue-chemistry" width="500"/>
</a>
</h2>

Vue Chemistry utilizes the `reactify` function and applies it to common JavaScript APIs, which enables a pure reactive programming experience. For example:

```js
import { set } from 'vue-chemistry'
import * as console from 'vue-chemistry/console'
import { pow, sqrt, sum } from 'vue-chemistry/math'

//      _________
// c = √ a² + b²
const a = ref(3)
const b = ref(4)
const c = sqrt(sum(pow(a, 2), pow(b, 2)))
console.log(c) // 5

set(a, 5) // shorthand for a.value = 5
set(b, 12)
console.log(c) // 13
```
