---
category: Sensors
---

# useKeybinds

Register keybinds/shortcuts.

## Usage

Register keybinds represented by key string and handler.

```ts
import { useKeybinds } from '@vueuse/core'
import { onMounted } from 'vue'

onMounted(() => {
  useKeybinds({
    KeyG: () => { /* do something */ },
  })
})
```

### Modifier keys

Key string supports also modifiers and sequences.

Modifiers are separated by `_` (`alt_KeyG`) and can be combined in alphabetical order (`alt_ctrl_meta_shift_KeyD`).

Note:

- `meta` key is `Command` key for MacOS or `Windows` key for Windows
- `Windows` key is usually not used for keybinds in applications
- `Command` keybinds are usually equal to `Ctrl` on Windows (and other OS)
  - Like copy: `Command + c` on MacOS is `Ctrl + c`
  - This convention is not specific to system commands and is used in apps as well

For convenience `meta` represents `Command` for MacOS and `Ctrl` for other OS.

Consider using `meta` instead of `ctrl` for more consistent experience across platforms.

Don't use both `ctrl` and `meta` modifiers as it won't work on all platforms.

```ts
import { useKeybinds } from '@vueuse/core'
import { onMounted } from 'vue'

onMounted(() => {
  useKeybinds({
    KeyG: () => {},
    meta_KeyK: () => {},
    alt_KeyG: () => {},
    alt_shift_KeyA: () => {},
  })
})
```

You can also customize this behavior with `normalizeCombinedKeyCode` option.

```ts
import { useKeybinds } from '@vueuse/core'
import { onMounted } from 'vue'

onMounted(() => {
  useKeybinds(
    {
      meta_KeyK: () => {},
    },
    {
      normalizeCombinedKeyCode: combinedKeyCode => combinedKeyCode // exact modifier keys
    }
  )
})
```

### Key sequences

Sequences are separated by `-` (`KeyM-KeyR`) and can be chained multiple times.

Modifiers and sequences can be also combined.

```ts
import { useKeybinds } from '@vueuse/core'
import { onMounted } from 'vue'

onMounted(() => {
  useKeybinds({
    'KeyM-KeyR': () => {},
    'ctrl_KeyK-ctrl_KeyT': () => {},
  })
})
```

### Key codes

Key is represented by key code, not the actual character, so it is easier to define.

If it was by key value, you would have to consider different key values with different modifiers.
For example is `s` with `shift` would become `shift_S` (uppercase) and `.` with `alt` would become `alt_>` (also depending on keyboard layout).

You can customize this behavior by passing options `getKeyCodeWithModifiers` or `getKeyCode`.

```ts
import { useKeybinds } from '@vueuse/core'
import { onMounted } from 'vue'

onMounted(() => {
  useKeybinds(
    {
      'KeyG': () => {},
      'alt_KeyG': () => {},
      'KeyM-KeyR': () => {},
      'ctrl_KeyK-ctrl_KeyT': () => {},
    },
    {
      getKeyCode: e => e.code // default implementation
    }
  )
})
```

### What events are suitable for keybinds

Not every key event should be considered for keybinds. Events from inputs and content editable elements are excluded by default.

If you need to customize these exceptions you can define which events are included by `includeEvent` option.

```ts
import { useKeybinds } from '@vueuse/core'
import { onMounted } from 'vue'

onMounted(() => {
  useKeybinds(
    {
      KeyG: () => {},
    },
    {
      includeEvent: (e) => {
        // not the actual default implementation
        return e.target?.tagName !== 'INPUT'
      }
    }
  )
})
```
