---
category: Browser
---

# useDark

Reactive dark mode with auto data persistence.

## Basic Usage

```js
import { useDark, useToggle } from '@vueuse/core'

const { isDark } = useDark()
const toggleDark = useToggle(isDark)
```

## Configuration

By default, it uses Tailwind CSS favored dark mode, which enables dark mode when class `dark` is applied to the `html` tag, for example:

```html
<!--light-->
<html> ... </html>

<!--dark-->
<html class="dark"> ... </html>
```

While you can customize it and make it works for most the of the CSS frameworks.

For example:

```ts
useDark({
  selector: 'body',
  attribute: 'color-scheme',
  valueDark: 'dark',
  valueLight: 'light'
})
```

will works like

```html
<!--light-->
<html>
  <body color-scheme="light"> ... </body>
</html>

<!--dark-->
<html>
  <body color-scheme="dark"> ... </body>
</html>
```

If the configuration above still not fitting to your needs, you can use `onChanged` options to take ful controls over how you handle the updates

```ts
useDark({
  onChanged(isDark) {
    // update the dom or something
  }
})
```
