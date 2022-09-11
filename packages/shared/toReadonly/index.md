---
category: Reactivity
---

# toReactive

Converts ref or refs in an object to readonly.

## Usage

```ts
import { toReadonly } from '@vueuse/core'

const width = ref(100)
const privateWidth = toReadonly(width)

privateWidth.value = -999 // error

// refs in an object
const x = ref(12)
const y = ref(34)
const { x: privateX, y: privateY } = toReadonly({ x, y })

privateX.value = -999 // error
privateY.value = -999 // error
```

## Use-cases

Privately assigning a ref, since size of the `window` should be readonly.
```ts
function useWindowSize() {
  const width = ref(0)
  const height = ref(0)

  // able to set the value
  window.addEventListener('resize', () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
  })

  // unable to set the value
  return toReadonly({
    width,
    height
  })
}

const { width, height } = useWindowSize()

// will get an error and the value won't change.
width.value = -999
```
