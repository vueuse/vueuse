---
category: Browser
---

# useBeforeUnload

Reactive state to handle beforeunload event.

## Usage

```ts
import { useBeforeUnload } from '@vueuse/core'

// Basic usage
const { setMessage, remove } = useBeforeUnload({
  message: 'Are you sure you want to leave?'
})

// Dynamic message
const { setMessage } = useBeforeUnload()
setMessage('You have unsaved changes!')

// Remove the event listener
const { remove } = useBeforeUnload()
remove()
```

## Type Declarations

```ts
export interface UseBeforeUnloadOptions extends ConfigurableWindow {
  /**
   * The message to show when the user tries to leave the page.
   * This is used to show a confirmation dialog.
   */
  message?: string
}

export function useBeforeUnload(options?: UseBeforeUnloadOptions): {
  setMessage: (message: string) => void
  remove: () => void
}
```

## Parameters

| Name      | Type                     | Default | Description    |
| --------- | ------------------------ | ------- | -------------- |
| `options` | `UseBeforeUnloadOptions` | `{}`    | Options object |

### UseBeforeUnloadOptions

| Name      | Type     | Default         | Description                            |
| --------- | -------- | --------------- | -------------------------------------- |
| `window`  | `Window` | `defaultWindow` | Custom window instance                 |
| `message` | `string` | `undefined`     | Message to show in confirmation dialog |

## Return Value

| Name         | Type                        | Description                           |
| ------------ | --------------------------- | ------------------------------------- |
| `setMessage` | `(message: string) => void` | Function to set a new message         |
| `remove`     | `() => void`                | Function to remove the event listener |

## Examples

### Basic Usage

```vue
<script setup>
import { useBeforeUnload } from '@vueuse/core'

const { setMessage, remove } = useBeforeUnload({
  message: 'You have unsaved changes. Are you sure you want to leave?'
})
</script>
```

### Dynamic Message

```vue
<script setup>
import { useBeforeUnload } from '@vueuse/core'
import { ref } from 'vue'

const hasUnsavedChanges = ref(false)
const { setMessage } = useBeforeUnload()

// Update message based on state
watch(hasUnsavedChanges, (newValue) => {
  if (newValue) {
    setMessage('You have unsaved changes. Are you sure you want to leave?')
  }
})
</script>
```

### Conditional Usage

```vue
<script setup>
import { useBeforeUnload } from '@vueuse/core'
import { computed } from 'vue'

const formData = ref({})
const hasChanges = computed(() => Object.keys(formData.value).length > 0)

const { setMessage, remove } = useBeforeUnload()

watch(hasChanges, (newValue) => {
  if (newValue) {
    setMessage('You have unsaved changes!')
  }
  else {
    remove()
  }
})
</script>
```
