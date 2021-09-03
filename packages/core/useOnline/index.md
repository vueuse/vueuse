---
category: Sensors
---

# useOnline

Reactive online state. A wrapper of `useNetwork`.

## Usage

```js
import { useOnline } from '@vueuse/core'

const online = useOnline()
```

## Component
```html
<UseOnline v-slot="{ isOnline }">
  Is Online: {{ isOnline }}
</UseOnline>
```
