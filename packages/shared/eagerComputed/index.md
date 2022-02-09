---
category: Utilities
---

# eagerComputed

Eager computed without lazy evaluation.

Learn more at [Vue: When a computed property can be the wrong tool](https://dev.to/linusborg/vue-when-a-computed-property-can-be-the-wrong-tool-195j).

- Use `computed()` when you have a complex calculation going on, which can actually profit from caching and lazy evaluation and should only be (re-)calculated if really necessary.
- Use `eagerComputed()` when you have a simple operation, with a rarely changing return value – often a boolean.

## Usage

```js
import { eagerComputed } from '@vueuse/core'

const todos = ref([])
const hasOpenTodos = eagerComputed(() => !!todos.length)

console.log(hasOpenTodos.value) // false
toTodos.value.push({ title: 'Learn Vue' })
console.log(hasOpenTodos.value) // true
```
