---
category: '@Shapes'
---

# useSquare

Composable for working with squares.

## Configuration

The `useSquare` function accepts a single configuration object as an argument, where each property has a default value if not provided.

| Property     | Default          | Description                            |
|:-------------|:-----------------|:---------------------------------------|
| `sideLength` | `0`              | The length of each side of the square. |
| `rotation`   | `0`              | The rotation of the square in degrees. |
| `center`     | `{ x: 0, y: 0 }` | A 2D Vector for center of the square.  |

## Usage

```ts
import { useSquare } from '@vueuse/shapes'

const sideLength = ref(50)
const center = ref({ x: 0, y: 0 })
const { vertices, edges } = useSquare({ sideLength, center })

// Calculate a position around the boundary of the square
const percentage = ref(0.25)
const position = square.getPosition(percentage) // { x: 50, y: -25 }
```
