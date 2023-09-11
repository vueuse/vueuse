---
category: '@Shapes'
---

# useCircle

Composable for working with circles.

## Usage

```ts
import { useCircle } from '@vueuse/shapes'

const radius = ref(50)
const circle = useCircle(radius)

// Calculate a position around the boundary of the circle
const percentage = ref(0.25)
const position = circle.getPosition(percentage) // { x: 25, y: 25 }
```
