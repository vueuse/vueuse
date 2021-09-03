---
category: Browser
---

# useBrowserLocation

Reactive browser location

## Usage

```js
import { useBrowserLocation } from '@vueuse/core'

const location = useBrowserLocation()
```

## Component

```html
<UseBrowserLocation v-slot="{ location }">
  Browser Location: {{ location }}
</UseBrowserLocation>
```

<LearnMoreComponents />
