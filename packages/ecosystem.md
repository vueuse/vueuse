# Ecosystem

While developing VueUse, we extract the tools we are using into separate projects that can be used standalone from time to time.

<h2 align="center">
<a href="https://github.com/vueuse/vue-chemistry" target="_blank">
<img src="https://github.com/vueuse/vue-chemistry/raw/main/res/hero.png" alt="vue-chemistry" width="500"/>
</a>
</h2>

Vue Chemistry utilizes the `reactify` function and applies it to common JavaScript APIs, which enables a pure reactive programming experience. For example:

```js
import * as console from 'vue-chemistry/console'
import { set } from 'vue-chemistry/core'
import { sum } from 'vue-chemistry/math'

const a = ref(1)
const b = ref(2)

const c = sum(a, b) // c = a + b = 3

set(a, 2) // shorthand for a.value = 2

console.log(c) // it's 4 (2 + 2)!
```
