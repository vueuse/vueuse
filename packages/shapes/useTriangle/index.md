---
category: '@Shapes'
---

# useTriangle

Composable for working with triangles.

## Configuration

The `useTriangle` function accepts a single configuration object as an argument, where each property has a default value if not provided.

| Property   | Default          | Description                              |
|:-----------|:-----------------|:-----------------------------------------|
| `base`     | `0`              | The base of the triangle.                |
| `height`   | `0`              | The height of the triangle.              |
| `rotation` | `0`              | The rotation of the triangle in degrees. |
| `center`   | `{ x: 0, y: 0 }` | A 2D Vector for center of the triangle.  |

## Usage

```ts
import { useTriangle } from '@vueuse/shapes'

const base = ref(50)
const height = ref(100)
const center = ref({ x: 0, y: 0 })
const { vertices, edges, getPosition } = useTriangle({ base, height, center })

// Calculate a position around the boundary of the triangle
const percentage = ref(0.25)
const position = getPosition(percentage)
```
