---
category: Reactivity
alias: transformedRef
---

# refTransformed

Transforms a ref to a ref with a different value format.

## Usage

```js
const numberRef = ref(0)
const stringRef = refTransformed(
  numberRef,
  value => value.toString(),
  value => parseFloat(value),
)

stringRef.value = '0.12' // numberRef.value === 0.12
numberRef.value = -2 // stringRef.value === "-2"
```
