---
category: State
---

# createInjectionState

Create global state that can be injected into components.

## Usage

```ts twoslash include useCounterStore
// useCounterStore.ts
import { createInjectionState } from '@vueuse/core'
import { computed, shallowRef } from 'vue'

const [useProvideCounterStore, useCounterStore] = createInjectionState((initialValue: number) => {
  // state
  const count = shallowRef(initialValue)

  // getters
  const double = computed(() => count.value * 2)

  // actions
  function increment() {
    count.value++
  }

  return { count, double, increment }
})

export { useProvideCounterStore }

// If you want to hide `useCounterStore` and wrap it in default value logic or throw error logic, please don't export `useCounterStore`
export { useCounterStore }

export function useCounterStoreWithDefaultValue() {
  return useCounterStore() ?? {
    count: shallowRef(0),
    double: shallowRef(0),
    increment: () => {},
  }
}

export function useCounterStoreOrThrow() {
  const counterStore = useCounterStore()
  if (counterStore == null)
    throw new Error('Please call `useProvideCounterStore` on the appropriate parent component')
  return counterStore
}
```

### Destructurable return (object form)

```ts
const pair = createInjectionState(fn)
// legacy tuple style
const [useProvide, useInject] = pair
// new object properties & aliases
const { useProvidingState, useInjectedState, provide, inject } = pair

// provide === useProvidingState; inject === useInjectedState
provide(/* args */)
const state = inject()
```

Use the object form when you prefer clearer semantics, while the tuple form continues to work without breaking changes.

```vue
<!-- RootComponent.vue -->
<script setup lang="ts">
// @filename: useCounterStore.ts
// @include: useCounterStore
// ---cut---
import { useProvideCounterStore } from './useCounterStore'

useProvideCounterStore(0)
</script>

<template>
  <div>
    <slot />
  </div>
</template>
```

```vue
<!-- CountComponent.vue -->
<script setup lang="ts">
// @filename: useCounterStore.ts
// @include: useCounterStore
// ---cut---
import { useCounterStore } from './useCounterStore'

// use non-null assertion operator to ignore the case that store is not provided.
const { count, double } = useCounterStore()!
// if you want to allow component to working without providing store, you can use follow code instead:
// const { count, double } = useCounterStore() ?? { count: shallowRef(0), double: shallowRef(0) }
// also, you can use another hook to provide default value
// const { count, double } = useCounterStoreWithDefaultValue()
// or throw error
// const { count, double } = useCounterStoreOrThrow()
</script>

<template>
  <ul>
    <li>
      count: {{ count }}
    </li>
    <li>
      double: {{ double }}
    </li>
  </ul>
</template>
```

```vue
<!-- ButtonComponent.vue -->
<script setup lang="ts">
// @filename: useCounterStore.ts
// @include: useCounterStore
// ---cut---
import { useCounterStore } from './useCounterStore'

// use non-null assertion operator to ignore the case that store is not provided.
const { increment } = useCounterStore()!
</script>

<template>
  <button @click="increment">
    +
  </button>
</template>
```

## Provide a custom InjectionKey

```ts
// useCounterStore.ts
import { createInjectionState } from '@vueuse/core'
import { computed, shallowRef } from 'vue'

// custom injectionKey
const CounterStoreKey = 'counter-store'

const [useProvideCounterStore, useCounterStore] = createInjectionState((initialValue: number) => {
  // state
  const count = shallowRef(initialValue)

  // getters
  const double = computed(() => count.value * 2)

  // actions
  function increment() {
    count.value++
  }

  return { count, double, increment }
}, { injectionKey: CounterStoreKey })
```

## Provide a custom default value

```ts
// useCounterStore.ts
import { createInjectionState } from '@vueuse/core'
import { computed, shallowRef } from 'vue'

const [useProvideCounterStore, useCounterStore] = createInjectionState((initialValue: number) => {
  // state
  const count = shallowRef(initialValue)

  // getters
  const double = computed(() => count.value * 2)

  // actions
  function increment() {
    count.value++
  }

  return { count, double, increment }
}, { defaultValue: 0 })
```
