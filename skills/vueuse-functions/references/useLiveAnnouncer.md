---
category: Browser
---

# useLiveAnnouncer

Accessible way to announce messages to screen reader users (ARIA live regions).

## Usage

```ts
import { useLiveAnnouncer } from '@vueuse/core'

const { announce, polite, assertive } = useLiveAnnouncer()

announce('This is a polite announcement')
polite('This is also a polite announcement')
assertive('Important message!')
```

The message stays in the live region until it is replaced by the next announcement. Pass a `timeout` (in milliseconds) to automatically clear it after a delay:

```ts
// clears the message after 3000ms
announce('Saved successfully', 'polite', 3000)
polite('Saved successfully', 3000)
assertive('Network error', 3000)
```

## Accessibility

The announcer uses the following ARIA attributes:

- **Polite**: `role="status"`, `aria-live="polite"`, `aria-atomic="true"`
- **Assertive**: `role="alert"`, `aria-live="assertive"`, `aria-atomic="true"`

These ensure robust support across different screen readers.

## Options

### idPrefix

- Type: `string`
- Default: `'vueuse-live-announcer'`

Prefix for the id of the announcer elements. The generated elements will have IDs `${idPrefix}-container`, `${idPrefix}-polite`, and `${idPrefix}-assertive`.

### window

- Type: `Window`
- Default: `defaultWindow`

The window object where the announcer elements will be created.

## Type Declarations

```ts
export interface UseLiveAnnouncerOptions extends ConfigurableWindow {
  /**
   * The prefix for the id of the announcer elements.
   * @default 'vueuse-live-announcer'
   */
  idPrefix?: string
}
export interface UseLiveAnnouncerReturn {
  announce: (
    message: string,
    mode?: "polite" | "assertive",
    timeout?: number,
  ) => void
  polite: (message: string, timeout?: number) => void
  assertive: (message: string, timeout?: number) => void
}
export declare function useLiveAnnouncer(
  options?: UseLiveAnnouncerOptions,
): UseLiveAnnouncerReturn
```
