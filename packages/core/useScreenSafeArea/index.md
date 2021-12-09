---
category: Browser
---

# useScreenSafeArea

Reactive `env(safe-area-inset-*)`

![image](https://webkit.org/wp-content/uploads/safe-areas-1.png)

## Usage

```ts
import { useScreenSafeArea } from '@vueuse/core'

const { 
  top, 
  right, 
  bottom, 
  left,
} = useScreenSafeArea()
```

## Component

```html
<UseScreenSafeArea top right bottom left>content</UseScreenSafeArea>
```
