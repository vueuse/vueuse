# 💡 Guide

// TODO: intro

[Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html)

## Destructuring

Most of the functions in VueUse returns an object of refs that you can use [ES6's object destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) syntax to take what you want. For example:

```ts
import { useMouse } from '@vueuse/core'

const { x, y } = useMouse()

// "x" and "y" will be "Ref<number>"
console.log(x.value) // 153
```

If you prefer to use them as object properties style, you can wrap the return value with `reactive()` to unwrap the refs. For example:

```ts {4}
import { reactive } from 'vue' 
import { useMouse } from '@vueuse/core'

const mouse = reactive(useMouse())

// "x" and "y" will be auto unwrapped, no `.value` needed
console.log(mouse.x) // 153
```

## Reactive Timing

// TODO:

## Configurable Global Dependencies

From v4.0, functions that access the browser APIs will provide options fields for you to specify the global dependencies (e.g. `window`, `document` and `navigator`). Most of the time, you don't need to configure it, it will use the global instance by default. This configure is useful when working with iframes and testing environments.  


```ts
// iframes
const parentMousePos = useMouse({ window: window.parent })
```

```ts
// testing
const mockWindow = /* ... */

const { x, y } = useMouse({ window: mockWindow })
```
