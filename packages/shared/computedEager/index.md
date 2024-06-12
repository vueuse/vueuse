---
category: Reactivity
alias: eagerComputed
---

# computedEager

Eager computed without lazy evaluation.

::: tip
Note💡: If you are using Vue 3.4+, you can straight use `computed` instead. Because in Vue 3.4+, if computed new value does not change, `computed`, `effect`, `watch`, `watchEffect`, `render` dependencies will not be triggered.
Refer: https://github.com/vuejs/core/pull/5912
:::

Learn more at [Vue: When a computed property can be the wrong tool](https://dev.to/linusborg/vue-when-a-computed-property-can-be-the-wrong-tool-195j).

- Use `computed()` when you have a complex calculation going on, which can actually profit from caching and lazy evaluation and should only be (re-)calculated if really necessary.
- Use `computedEager()` when you have a simple operation, with a rarely changing return value – often a boolean.

## Usage

```js
import { computedEager } from '@vueuse/core'

const todos = ref([])
const hasOpenTodos = computedEager(() => !!todos.length)

console.log(hasOpenTodos.value) // false
toTodos.value.push({ title: 'Learn Vue' })
console.log(hasOpenTodos.value) // true
```
