---
category: Time
---

# useTimeAgo

Reactive time ago. Automatically update the time ago string when the time changes.

## Usage

```ts
import { useTimeAgo } from '@vueuse/core'

const timeAgo = useTimeAgo(new Date(2021, 0, 1))
```

## Component Usage

```vue
<template>
  <UseTimeAgo v-slot="{ timeAgo }" :time="new Date(2021, 0, 1)">
    Time Ago: {{ timeAgo }}
  </UseTimeAgo>
</template>
```

## Non-Reactivity Usage

In case you don't need the reactivity, you can use the `formatTimeAgo` function to get the formatted string instead of a Ref.

```ts
import { formatTimeAgo } from '@vueuse/core'

const timeAgo = formatTimeAgo(new Date(2021, 0, 1)) // string
```
