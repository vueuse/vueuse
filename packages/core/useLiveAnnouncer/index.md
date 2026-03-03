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

## Accessibility

The announcer uses the following ARIA attributes:

- **Polite**: `role="status"`, `aria-live="polite"`, `aria-atomic="true"`
- **Assertive**: `role="alert"`, `aria-live="assertive"`, `aria-atomic="true"`

These ensure robust support across different screen readers.

## Options

### idPrefix

- Type: `string`
- Default: `'vueuse-announcer'`

Prefix for the id of the announcer elements. The generated elements will have IDs `${idPrefix}-container`, `${idPrefix}-polite`, and `${idPrefix}-assertive`.

### window

- Type: `Window`
- Default: `defaultWindow`

The window object where the announcer elements will be created.
