---
category: Accessibility
---

# useLiveAnnouncer

Provides a way to announce messages to screen reader users using ARIA live regions.

This composable creates a hidden live region in the DOM that can be used to announce dynamic content changes to screen reader users. It follows ARIA best practices for live regions and works across different browsers and screen readers.

## Basic Usage

```ts
import { useLiveAnnouncer } from '@vueuse/core'

const { announce, polite, assertive, clear } = useLiveAnnouncer()

// Announce a message with polite politeness (default)
announce('Item added to cart')

// Same as above
polite('Item added to cart')

// Announce with assertive politeness for critical updates
assertive('Error: Please fill in all required fields')

// Clear any current announcement
clear()
```

## Politeness Levels

### Polite (default)

Use `polite` for non-critical updates that don't need immediate attention. The screen reader will announce the message when the user pauses.

```ts
const { polite } = useLiveAnnouncer()

// Non-critical updates
polite('3 new messages')
polite('Autosave completed')
```

### Assertive

Use `assertive` for critical updates that need immediate attention. This will interrupt the screen reader's current announcement.

```ts
const { assertive } = useLiveAnnouncer()

// Critical updates
assertive('Form submission failed')
assertive('Session expired, please log in again')
```

## With Vue Components

```vue
<script setup lang="ts">
import { useLiveAnnouncer } from '@vueuse/core'

const { announce, assertive } = useLiveAnnouncer()

function addToCart(itemName: string) {
  // ... add to cart logic
  announce(`${itemName} added to cart`)
}

function showError(message: string) {
  assertive(`Error: ${message}`)
}
</script>

<template>
  <button @click="addToCart('Product')">
    Add to Cart
  </button>
</template>
```

## Custom Timeout

You can customize the timeout for clearing the live region:

```ts
const { announce } = useLiveAnnouncer({ defaultTimeout: 300 })

// Or per announcement
announce('Message', 'polite', 500)
```

## Configuration

```ts
const { announce } = useLiveAnnouncer({
  // Default politeness level
  defaultPoliteness: 'polite', // or 'assertive'

  // Default timeout in milliseconds
  defaultTimeout: 150,
})
```

## Accessibility Best Practices

1. **Use polite for most announcements** - Reserve assertive for truly critical information
2. **Keep messages concise** - Screen reader users prefer brief, clear messages
3. **Don't announce too frequently** - Avoid overwhelming users with announcements
4. **Test with screen readers** - Test with NVDA, JAWS, VoiceOver to ensure announcements work correctly

## Related

- [ARIA Live Regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)
- [useFocus](./useFocus)
- [useElementVisibility](./useElementVisibility)
