# useMouse

> Reactive mouse position

## Basic Usage

```js
import { useMouse } from '@vueuse/core'

const { x, y, source } = useMouse()
```

Touching is enabled by default. To make it only detects mouse changes, set `touch` to `false`

```js
const { x, y } = useMouse({ touch: false })
```

