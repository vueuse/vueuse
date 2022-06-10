---
category: Browser
---

# useDir

Reactive [dir](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir) of the element's text.

## Basic Usage

```ts
import { useDir } from '@vueuse/core'

const dir = useDir() // Ref<'ltr' | 'rtl' | 'auto'>

```
By default, which enables `rlt` direction when dir `rtl` is applied to the `html` tag, for example:

```html
<!--ltr-->
<html> ... </html>

<!--rtl-->
<html dir="rtl"> ... </html>
```

## Config

```ts
import { useDir } from '@vueuse/core'

const mode = useDir({
  selector: 'body'
}) // Ref<'ltr' | 'rtl' | 'auto'>
```
