---
category: '@Shapes'
---

# useSquare

Composable for working with squares.

## Usage

```ts
import { useSquare } from '@vueuse/shapes'

const size = ref(50)
const center = ref({ x: 0, y: 0 })
const square = useSquare(size, center)

// Calculate a position around the boundary of the square
const percentage = ref(0.25)
const position = square.getPosition(percentage) // { x: 50, y: -25 }
```
