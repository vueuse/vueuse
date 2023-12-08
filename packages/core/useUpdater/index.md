---
category: Utilities
---

# useUpdater

Used to indicate that the system has been updated

## Usage

```ts
import { useUpdater } from '@vueuse/core'

const [handleNoUpdate, handleUpdate] = useUpdater(7000, '/xxx/main')
handleNoUpdate(() => {
  // TODO: not up-to-date
})
handleUpdate(() => {
  // TODO: updated
  alert('The system has been updated, please force the browser!')
})
```

## Parameter

The default loop detection time is **10** seconds, and the default detection path is `/main`

## Type Declarations

```ts
export interface Fn<T = any> {
  (...arg: T[]): T
}

export interface useUpdaterOptions {
  timer?: number
  path?: string
}

export declare function useUpdater(timer: useUpdaterOptions.timer, path: useUpdaterOptions.path): Fn[]
```
