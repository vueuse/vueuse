# Best Practice

### Destructuring

Most of the functions in VueUse return an **object of refs** that you can use [ES6's object destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) syntax on to take what you need. For example:

```ts
import { useMouse } from '@vueuse/core'

// "x" and "y" are refs
const { x, y } = useMouse()

console.log(x.value)

const mouse = useMouse()

console.log(mouse.x.value)
```

If you prefer to use them as object properties style, you can unwrap the refs by using `reactive()`. For example:

```ts
import { reactive } from 'vue'
import { useMouse } from '@vueuse/core'

const mouse = reactive(useMouse())

// "x" and "y" will be auto unwrapped, no `.value` needed
console.log(mouse.x)
```

### Side-effect Clean Up

Similar to Vue's `watch` and `computed` that will be disposed when the component is unmounted, VueUse's functions also clean up the side-effects automatically.

For example, `useEventListener` will call `removeEventListener` when the component is unmounted so you don't need to worry about it.

```ts
// will cleanup automatically
useEventListener('mousemove', () => {})
```

All VueUse functions follow this convention.

To manually dispose the side-effects, some function returns a stop handler just like the `watch` function. For example:

```ts
const stop = useEventListener('mousemove', () => {})

// ...

// unregister the event listener manually
stop()
```

While not all function return the handler, a more general solution is to use the [`effectScope` API](https://vuejs.org/api/reactivity-advanced.html#effectscope) from Vue.

```ts
import { effectScope } from 'vue'

const scope = effectScope()

scope.run(() => {
  // ...

  useEventListener('mousemove', () => {})
  onClickOutside(el, () => {})
  watch(source, () => {})
})

// all composables called inside `scope.run` will be disposed
scope.stop()
```

You can learn more about effect scope in [this RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md).

### Passing Ref as Argument

In Vue, we use the `setup()` function to construct the "connections" between the data and logics. To make it flexible, most of the VueUse function also accepts ref version of the arguments.

Taking `useTitle` as an example:

###### Normal usage

Normally `useTitle` return a ref that reflects to the page's title. When you assign new value to the ref, it automatically updates the title.

```ts
const isDark = useDark()
const title = useTitle('Set title')

watch(isDark, () => {
  title.value = isDark.value ? '🌙 Good evening!' : '☀️ Good morning!'
})
```

###### Connection usage

If you think in "connection", you can instead passing a ref that make it bind to the page's title.

```ts
const isDark = useDark()
const title = computed(() => isDark.value ? '🌙 Good evening!' : '☀️ Good morning!')

useTitle(title)
```

###### Reactive Getter

Since VueUse 9.0, we introduce a new convention for passing "Reactive Getter" as the argument. Which works great with reactive object and [Reactivity Transform](https://vuejs.org/guide/extras/reactivity-transform.html#reactivity-transform).

```ts
const isDark = useDark()

useTitle(() => isDark.value ? '🌙 Good evening!' : '☀️ Good morning!')
```
