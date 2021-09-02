---
category: Formatters
---

# useTimeAgo

Reactive time ago.

## Usage

```js
import { useTimeAgo } from '@vueuse/core'

const timeAgo = useTimeAgo(new Date(2021, 0, 1))
```

## Component

```html
<UseTimeAgo v-slot="{ timeAgo }" :time="new Date(2021, 0, 1)">
  Time Ago: {{ timeAgo }}
</UseTimeAgo>
```

<LearnMoreComponents />
