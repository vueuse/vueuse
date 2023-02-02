---
category: Array
---

# useTreeFind

Reactively find elements in a tree structure

## Usage

### Use with array of multiple refs

```js
import { useTreeFind } from '@vueuse/core'
import { ref } from 'vue'

const item1 = ref({ id: '1', children: [{ id: '1-1' }] })
const item2 = ref({ id: '2', children: [{ id: '2-1' }] })
const item3 = ref({ id: '3', children: [{ id: '3-1' }] })
const item4 = ref({ id: '4' })
const item5 = ref({ id: '5' })
const tree = ref([item1, item2, item3, item4, item5])
const result = useTreeFind(tree, item => item.id === '3-1')
// result.value: { id: '3-1' }
item3.value = { id: '3', children: [{ id: '3-1-1' }] }
// result.value: undefined
```

### Use with ref array

```js
import { useTreeFind } from '@vueuse/core'
import { ref } from 'vue'

const tree = ref([
  {
    id: '1',
    children: [
      {
        id: '1-1',
      },
    ],
  },
  {
    id: '2',
    children: [
      {
        id: '2-1',
        children: [
          {
            id: '2-1-1',
          },
        ],
      },
    ],
  },
])

const result = useTreeFind(tree, item => item.id === '2-1-1')
// result.value.id: '2-1-1'

tree.value.pop()
// result.value: undefined

tree.value.push({
  id: '2-1',
  children: [
    {
      id: '2-1-1',
    },
  ],
})

// result.value.id: '2-1-1'
```
