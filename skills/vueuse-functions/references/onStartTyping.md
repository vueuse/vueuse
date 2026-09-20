---
category: Sensors
---

# onStartTyping

Fires when users start typing on non-editable elements. Useful for auto-focusing an input field when the user starts typing anywhere on the page.

## Usage

```vue
<script setup lang="ts">
import { onStartTyping } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const input = useTemplateRef('input')

onStartTyping(() => {
  if (!input.value.active)
    input.value.focus()
})
</script>

<template>
  <input ref="input" type="text" placeholder="Start typing to focus">
</template>
```

## Custom Valid Key

```ts
import { onStartTyping } from '@vueuse/core'

onStartTyping(handleKey, {
  // only allow numbers
  isTypedCharValid: e => /^\d$/.test(e.key)
})
```

## Custom Editable Element

```ts
import { isFocusedElementEditable as defaultEditable, onStartTyping } from '@vueuse/core'

onStartTyping(handleKey, {
  isFocusedElementEditable: () => {
    const { activeElement } = document

    // Exclude elements with id 'targetInput'
    if (activeElement?.id === 'targetInput')
      return true

    return defaultEditable()
  }
})
```

## How It Works

The callback only fires when:

- No editable element (`<input>`, `<textarea>`, or `contenteditable`) is focused
- The pressed key is alphanumeric (A-Z, 0-9)
- No modifier keys (Ctrl, Alt, Meta) are held

This allows users to start typing anywhere on the page without accidentally triggering the callback when using keyboard shortcuts or interacting with form fields.

Both `isFocusedElementEditable` and `isTypedCharValid` are also exported as utility functions, so you can reuse them when writing custom options.

## Type Declarations

```ts
export declare function isFocusedElementEditable(): boolean
export declare function isTypedCharValid({
  keyCode,
  metaKey,
  ctrlKey,
  altKey,
}: KeyboardEvent): boolean
export interface OnStartTypingOptions extends ConfigurableDocument {
  isTypedCharValid?: (event: KeyboardEvent) => boolean
  isFocusedElementEditable?: () => boolean
}
/**
 * Fires when users start typing on non-editable elements.
 *
 * @see https://vueuse.org/onStartTyping
 * @param callback
 * @param options
 */
export declare function onStartTyping(
  callback: (event: KeyboardEvent) => void,
  options?: OnStartTypingOptions,
): void
```
