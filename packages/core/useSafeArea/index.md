---
category: Browser
---

# useSafeArea

Reactive `env(safe-area-inset-*)`

![image](https://webkit.org/wp-content/uploads/safe-areas-1.png)

## Usage

```ts
import { useSafeArea } from '@vueuse/core'

const { top, right, bottom, left } = useSafeArea()
```

## Component

```html
<UseSafeArea top right bottom left>content</UseSafeArea>
```
