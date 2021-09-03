---
category: Browser
---

# useActiveElement

Reactive `document.activeElement`

## Usage

```js
import { useActiveElement } from '@vueuse/core'

const activeElement = useActiveElement()

watch(activeElement, (el) => {
  console.log('focus changed to', el)
})
```

## Component

```html
<UseActiveElement v-slot="{ element }">
  Active element is {{ element.dataset.id }}
</UseActiveElement>
```

<LearnMoreComponents />
