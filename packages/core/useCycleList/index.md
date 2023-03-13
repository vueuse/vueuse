---
category: Utilities
---

# useCycleList

Cycle through a list of items.

<CourseLink href="https://vueschool.io/lessons/create-an-image-carousel-with-vueuse?friend=vueuse">Learn how to use useCycleList to create an image carousel with this FREE video lesson from Vue School!</CourseLink>

## Usage

```ts
import { useCycleList } from '@vueuse/core'

const list = ref([
  'Dog',
  'Cat',
  'Lizard',
  'Shark',
  'Whale',
  'Dolphin',
  'Octopus',
  'Seal',
])
const { state, next, prev } = useCycleList(list)

console.log(state.value) // 'Dog'

prev()

console.log(state.value) // 'Seal'
```
