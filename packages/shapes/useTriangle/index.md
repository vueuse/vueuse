---
category: '@Shapes'
---

# useTriangle

Composable for working with triangles.

## Configuration

The `useTriangle` function accepts a single configuration object as an argument, where each property has a default value if not provided.

| Property     | Default          | Description                              |
|:-------------|:-----------------|:-----------------------------------------|
| `sideLength` | `0`              | The length of each side of the triangle. |
| `center`     | `{ x: 0, y: 0 }` | A 2D Vector for center of the triangle.  |

## Usage

```ts
import { useTriangle } from '@vueuse/shapes'

const sideLength = ref(50)
const center = ref({ x: 0, y: 0 })
const triangle = useTriangle({ sideLength, center })

// Calculate a position around the boundary of the triangle
const percentage = ref(0.25)
const position = triangle.getPosition(percentage)
```
