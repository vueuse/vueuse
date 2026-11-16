---
category: Browser
---

# useTextDirection

Reactive [dir](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir) of the element's text.

## Usage

```ts
import { useTextDirection } from '@vueuse/core'

const dir = useTextDirection() // Ref<'ltr' | 'rtl' | 'auto'>
```

By default, it returns `rtl` direction when dir `rtl` is applied to the `html` tag, for example:

```html
<!--ltr-->
<html>
  ...
</html>

<!--rtl-->
<html dir="rtl">
  ...
</html>
```

## Options

```ts
import { useTextDirection } from '@vueuse/core'

const mode = useTextDirection({
  selector: 'body'
}) // Ref<'ltr' | 'rtl' | 'auto'>
```

## Read a specific element

Pass an element ref or Vue component ref as the first argument to read its computed CSS direction. This is useful when a nested element has a different direction from the document root.

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useTextDirection } from '@vueuse/core'

const editor = useTemplateRef('editor')
const dir = useTextDirection(editor, { observe: true })
</script>

<template>
  <div ref="editor" dir="rtl">
    Text direction follows this element.
  </div>
  <p>Current direction: {{ dir }}</p>
</template>
```

When a reactive element ref changes, the returned ref updates to the new element's computed direction. With `observe: true`, attribute changes on the target element are also observed.

For element targets, assigning to the returned ref updates the target element's `dir` attribute. The existing options-only form continues to read and write the configured document element.
