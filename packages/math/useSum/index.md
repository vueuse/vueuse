---
category: '@Math'
---

# useSum

Reactively adds the values together.

## Usage

```ts
import { useSum } from '@vueuse/math'

const value = ref(10)
const obj = reactive({ num: 20 })

// ref or getter
const sum = useSum([value1, () => obj.num])
// sum.value: 30
```

### Use with reactive array
```ts
import { useSum } from '@vueuse/math'

const list = reactive([10, 20])
const sum = useSum(list)

list.push(5)
// sum.value: 35
```

### Custom adder and initialized values
```ts
// custom adder
const sum1 = useSum(
  ref([10, 20]),
  (sum, value) => sum * value,
)

// initialization value
const sum2 = useSum(
  ref([{ a: 1 }, { a: 2 }]),
  (sum, value) => sum + value.a,
  0
)
```
