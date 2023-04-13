---
category: Time
---

# useTimeAgo

Reactive time ago. Automatically update the time ago string when the time changes.

## Usage

```js
import { useTimeAgo } from '@vueuse/core'

const timeAgo = useTimeAgo(new Date(2021, 0, 1))
```

## Component Usage

```html
<UseTimeAgo v-slot="{ timeAgo }" :time="new Date(2021, 0, 1)">
  Time Ago: {{ timeAgo }}
</UseTimeAgo>
```

## Non-Reactivity Usage

In case you don't need the reactivity, you can use the `formatTimeAgo` function to get the formatted string instead of a Ref.

```js
import { formatTimeAgo } from '@vueuse/core'

const timeAgo = formatTimeAgo(new Date(2021, 0, 1)) // string
```
