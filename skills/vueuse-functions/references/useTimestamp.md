---
category: Animation
---

# useTimestamp

Reactive current timestamp

## Usage

```ts
import { useTimestamp } from '@vueuse/core'

const timestamp = useTimestamp({ offset: 0 })
```

```ts
import { useTimestamp } from '@vueuse/core'
// ---cut---
const { timestamp, pause, resume } = useTimestamp({ controls: true })
```

## Component Usage

```vue
<template>
  <UseTimestamp v-slot="{ timestamp, pause, resume }">
    Current Time: {{ timestamp }}
    <button @click="pause()">
      Pause
    </button>
    <button @click="resume()">
      Resume
    </button>
  </UseTimestamp>
</template>
```

## Type Declarations

```ts
export interface UseTimestampOptions<
  Controls extends boolean,
> extends ConfigurableScheduler {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls
  /**
   * Offset value adding to the value
   *
   * @default 0
   */
  offset?: number
  /**
   * Callback on each update
   */
  callback?: (timestamp: number) => void
}
export type UseTimestampReturn<Controls extends boolean> = Controls extends true
  ? {
      timestamp: ShallowRef<number>
    } & Pausable
  : ShallowRef<number>
/**
 * Reactive current timestamp.
 *
 * @see https://vueuse.org/useTimestamp
 * @param options
 */
export declare function useTimestamp(
  options?: UseTimestampOptions<false>,
): ShallowRef<number>
export declare function useTimestamp(options: UseTimestampOptions<true>): {
  timestamp: ShallowRef<number>
} & Pausable
```
