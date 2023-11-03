---
category: '@Shapes'
---

# usePolygon

Composable for working with polygons.

## Configuration

The `usePolygon` function accepts a single configuration object as an argument, where each property has a default value if not provided.

| Property     | Default          | Description                                  |
|:-------------|:-----------------|:---------------------------------------------|
| `sides`      | `0`              | The number of sides of the polygon.          |
| `sideLength` | `0`              | The length of each side of the polygon.      |
| `rotation`   | `0`              | The rotation of the polygon in degrees.      |
| `center`     | `{ x: 0, y: 0 }` | A 2D Vector for the center of the polygon.   |

## Usage

```ts
import { usePolygon } from '@vueuse/shapes'

const sides = ref(5)
const sideLength = ref(50)
const center = ref({ x: 0, y: 0 })
const { vertices, edges, getPosition } = usePolygon({ sides, sideLength, center })

// Calculate a position around the boundary of the polygon
const percentage = ref(0.25)
const position = getPosition(percentage) // Will return a 2D Vector depending on the sides and sideLength values
```
