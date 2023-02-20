---
category: Utilities
related: useDebounceFn
---

# useSearch

Reactive search list data.

## Usage

### Use object array refs



```ts
import { ref } from 'vue'
import { useSearch } from '@vueuse/core'

const list = ref([
  {
    name: 'Jane1',
    age: 20,
  },
  {
    name: 'Jane2',
    age: 22,
  },
  {
    name: 'Yang1',
    age: 30,
  },
  {
    name: 'Yang2',
    age: 40,
  },
])

const keyword = ref('')
const { data } = useSearch(list, keyword, {
  field: 'name'
})
// data.value = list.value

keyword.value = 'Jane'
// data.value: [{ name: 'Jane1', age: 20 }, { name: 'Jane2', age: 22 }]

search('Yang')
// data.value: [{ name: 'Yang1', age: 30 }, { name: 'Yang2', age: 40 }]
```

### Use string array refs

```ts
import { ref } from 'vue'
import { useSearch } from '@vueuse/core'

const list = ref(['Jane1', 'Jane2', 'Yang1', 'Yang2'])
const keyword = ref('')
const { data, search } = useSearch(list, keyword)
// data.value = list.value

keyword.value = 'Jane'
// data.value: ['Jane1', 'Jane2']

search('Yang')
// data.value: ['Yang1', 'Yang2']
```
