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

By default, it uses [Tailwind CSS favored dark mode](https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually), which enables dark mode when class `dark` is applied to the `html` tag, for example:

```html
<!--light-->
<html> ... </html>

<!--dark-->
<html class="dark"> ... </html>
```

While you can customize it and make it works for most the of the CSS frameworks.

For example:

```ts
const isDark = useDark({
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
const isDark = useDark({
  onChanged(dark: boolean) {
    // update the dom or something
  }
})
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export interface UseDarkOptions extends StorageOptions {
  /**
   * CSS Selector for the target element applying to
   *
   * @default 'html'
   */
  selector?: string
  /**
   * HTML attribute applying the target element
   *
   * @default 'class'
   */
  attribute?: string
  /**
   * Value applying to the target element when isDark=true
   *
   * @default 'dark'
   */
  valueDark?: string
  /**
   * Value applying to the target element when isDark=false
   *
   * @default ''
   */
  valueLight?: string
  /**
   * A custom handler for handle the updates.
   * When specified, the default behavior will be overridded.
   *
   * @default undefined
   */
  onChanged?: (isDark: boolean) => void
  /**
   * Key to persist the data into localStorage/sessionStorage.
   *
   * Pass `null` to disable persistence
   *
   * @default 'vueuse-color-scheme'
   */
  storageKey?: string | null
  /**
   * Storage object, can be localStorage or sessionStorage
   *
   * @default localStorage
   */
  storage?: StorageLike
}
export declare type ColorSchemes = "light" | "dark" | "auto"
/**
 * Reactive dark mode with auto data persistence.
 *
 * @see   {@link https://vueuse.js.org/useDark}
 * @param options
 */
export declare function useDark(
  options?: UseDarkOptions
): WritableComputedRef<boolean>
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/master/packages/core/useDark/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/master/packages/core/useDark/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/master/packages/core/useDark/index.md)


<!--FOOTER_ENDS-->
