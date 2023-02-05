---
category: Utilities
related: reactify
---

# editorRef

Make a ref to copy of given field of the given object that gets updated when the original object's property gets changed.
This is used in editor components where the local copy of a value is needed so that the editor can decide when the  value gets updated (or never if the user cancels the edit)

## Usage

```ts
import { editorRef } from '@vueuse/core'

// Define some properties that you'd like to edit
const props = defineProps<{
  name: string
}>()

// Construct a local copy of the prop for editing
const editableName = editorRef(props, 'name')
editableName.value = 'changed'

// At a later time you can propagate the changed value upwards
// which will automatically propagate the value down to `editableName`
// including when the user modified that value elsewhere
const emit = defineEvents(['update:name'])
emit('update:name', editableName.value)
```
