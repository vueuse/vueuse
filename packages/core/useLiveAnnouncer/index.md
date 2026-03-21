---
category: Browser
---

# useLiveAnnouncer

Accessible way to announce messages to screen reader users via ARIA live regions.

## Usage

```ts
import { useLiveAnnouncer } from '@vueuse/core'

const { announce, polite, assertive, message } = useLiveAnnouncer()

// Polite announcement (default) - waits for screen reader to finish current speech
polite('Item saved successfully')

// Assertive announcement - interrupts current speech immediately
assertive('Error: failed to save')

// Base announce function with explicit mode
announce('Processing complete', 'polite')
announce('Connection lost!', 'assertive')
```

### Custom Timeout

By default, announcements are cleared after 7 seconds. You can customize this per-call or globally:

```ts
import { useLiveAnnouncer } from '@vueuse/core'

// Global default timeout
const { polite, assertive } = useLiveAnnouncer({ timeout: 5000 })

// Per-call timeout override
polite('Saved', 3000)

// Disable auto-clear for a specific call
assertive('Persistent error message', 0)
```

## Accessibility

The composable creates visually hidden DOM elements with the following ARIA attributes:

- **Polite**: `role="status"`, `aria-live="polite"`, `aria-atomic="true"`
- **Assertive**: `role="alert"`, `aria-live="assertive"`, `aria-atomic="true"`

These attributes ensure reliable support across different screen readers (NVDA, JAWS, VoiceOver).
