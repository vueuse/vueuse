---
category: Animation
---

# useTimestamp

Reactive current timestamp

## Usage

```ts
import { useTimestamp } from '@vueuse/core'

const timestamp = useTimestamp({ offset: 0 })
```

```ts
import { useTimestamp } from '@vueuse/core'
// ---cut---
const { timestamp, pause, resume } = useTimestamp({ controls: true })
```

## Component Usage

```vue
<template>
  <UseTimestamp v-slot="{ timestamp, pause, resume }">
    Current Time: {{ timestamp }}
    <button @click="pause()">
      Pause
    </button>
    <button @click="resume()">
      Resume
    </button>
  </UseTimestamp>
</template>
```
