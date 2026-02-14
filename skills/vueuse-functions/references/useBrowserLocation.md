---
category: Browser
---

# useBrowserLocation

Reactive browser location

> NOTE: If you're using Vue Router, use [`useRoute`](https://router.vuejs.org/guide/advanced/composition-api.html) provided by Vue Router instead.

## Usage

```ts
import { useBrowserLocation } from '@vueuse/core'

const location = useBrowserLocation()
```

## Component Usage

```vue
<UseBrowserLocation v-slot="location">
  Browser Location: {{ location }}
</UseBrowserLocation>
```

## Type Declarations

```ts
export interface BrowserLocationState {
  readonly trigger: string
  readonly state?: any
  readonly length?: number
  readonly origin?: string
  hash?: string
  host?: string
  hostname?: string
  href?: string
  pathname?: string
  port?: string
  protocol?: string
  search?: string
}
/**
 * Reactive browser location.
 *
 * @see https://vueuse.org/useBrowserLocation
 *
 * @__NO_SIDE_EFFECTS__
 */
export declare function useBrowserLocation(options?: ConfigurableWindow): Ref<
  {
    readonly trigger: string
    readonly state?: any
    readonly length?: number | undefined
    readonly origin?: string | undefined
    hash?: string | undefined
    host?: string | undefined
    hostname?: string | undefined
    href?: string | undefined
    pathname?: string | undefined
    port?: string | undefined
    protocol?: string | undefined
    search?: string | undefined
  },
  | BrowserLocationState
  | {
      readonly trigger: string
      readonly state?: any
      readonly length?: number | undefined
      readonly origin?: string | undefined
      hash?: string | undefined
      host?: string | undefined
      hostname?: string | undefined
      href?: string | undefined
      pathname?: string | undefined
      port?: string | undefined
      protocol?: string | undefined
      search?: string | undefined
    }
>
export type UseBrowserLocationReturn = ReturnType<typeof useBrowserLocation>
```
