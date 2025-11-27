---
category: Reactivity
alias: resolveRef
---

# toRef

Normalize value/ref/getter to `ref` or `computed`.

## Usage

```ts
import { toRef } from '@vueuse/core'

const foo = ref('hi')

const a = toRef(0) // Ref<number>
const b = toRef(foo) // Ref<string>
const c = toRef(() => 'hi') // ComputedRef<string>
```

## Differences from Vue's `toRef`

VueUse's `toRef` is not the same as Vue’s `toRef` from the `vue` package.

### VueUse `toRef`

- Accepts **value**, **ref**, or **getter**
- Returns:
  - a **ref** for primitive values
  - a **ref** for existing refs
  - a **computed** for getter functions
- Does **not** accept `object + key`
- Getters always produce readonly computed values

### Vue `toRef`

- Accepts only:
  - a **reactive object + property key**, or
  - an existing **ref**
- Produces a **writable ref** linked to the underlying reactive object
- Does **not** accept primitive values
- Does **not** accept getter functions

### Summary

| Behavior                 | VueUse `toRef`            | Vue `toRef`             |
| ------------------------ | ------------------------- | ----------------------- |
| Accepts primitive values | ✔️                        | ❌                      |
| Accepts getter           | ✔️ (computed)             | ❌                      |
| Accepts existing ref     | ✔️                        | ✔️                      |
| Accepts object + key     | ❌                        | ✔️                      |
| Writable                 | ✔️ (except getter)        | ✔️                      |
| Purpose                  | Normalize to ref/computed | Bind to reactive object |
