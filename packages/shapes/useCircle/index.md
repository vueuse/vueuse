---
category: '@Shapes'
---

# useCircle

Composable for working with circles.

## Configuration

The `useCircle` function accepts a single configuration object as an argument, where each property has a default value if not provided.

| Property | Default          | Description                           |
|:---------|:-----------------|:--------------------------------------|
| `radius` | `0`              | The radius of the circle.             |
| `center` | `{ x: 0, y: 0 }` | A 2D Vector for center of the circle. |

## Usage

```ts
import { useCircle } from '@vueuse/shapes'

const radius = ref(50)
const circle = useCircle({ radius })

// Calculate a position around the boundary of the circle
const percentage = ref(0.25)
const position = circle.getPosition(percentage) // { x: 0, y: 50 }
```
