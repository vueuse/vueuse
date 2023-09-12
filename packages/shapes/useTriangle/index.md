---
category: '@Shapes'
---

# useTriangle

Composable for working with triangles.

## Usage

```ts
import { useTriangle } from '@vueuse/shapes'

const baseLength = ref(50)
const center = ref({ x: 0, y: 0 })
const triangle = useTriangle(baseLength, center)

// Calculate a position around the boundary of the triangle
const percentage = ref(0.25)
const position = triangle.getPosition(percentage)
```
