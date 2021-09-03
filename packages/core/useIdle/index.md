---
category: Sensors
---

# useIdle

Tracks whether the user is being inactive.

## Usage

```js
import { useIdle } from '@vueuse/core'

const { idle, lastActive } = useIdle(5 * 60 * 1000) // 5 min

console.log(idle.value) // true or false
```

## Component
```html
<UseIdle v-slot="{ isIdle }" :timeout="5 * 60 * 1000">
  Is Idle: {{ isIdle }}
</UseIdle>
```
