---
category: '@Shapes'
---

# useRectangle

Composable for working with rectangles.

## Configuration

The `useRectangle` function accepts a single configuration object as an argument, where each property has a default value if not provided.

| Property     | Default          | Description                                  |
|:-------------|:-----------------|:---------------------------------------------|
| `width`      | `0`              | The width of the rectangle.                  |
| `height`     | `0`              | The height of the rectangle.                 |
| `center`     | `{ x: 0, y: 0 }` | A 2D Vector for center of the rectangle.     |

## Usage

```ts
import { useRectangle } from '@vueuse/shapes'

const width = ref(50)
const height = ref(100)
const center = ref({ x: 0, y: 0 })
const { vertices, edges } = useRectangle({ width, height, center })

// Calculate a position around the boundary of the rectangle
const percentage = ref(0.25)
const position = rectangle.getPosition(percentage) // { x: 50, y: -25 }
```
