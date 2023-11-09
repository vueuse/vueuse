---
category: Browser
---

# useScriptTag

Creates a script tag, with support for automatically unloading (deleting) the script tag on unmount.

If a script tag already exists for the given URL, `useScriptTag()` will not create another script tag, but keep in mind that depending on how you use it, `useScriptTag()` might have already loaded then unloaded that particular JS file from a previous call of `useScriptTag()`.

## Usage

```ts
import { useScriptTag } from '@vueuse/core'

useScriptTag(
  'https://player.twitch.tv/js/embed/v1.js',
  // on script tag loaded.
  (el: HTMLScriptElement) => {
    // do something
  },
)
```

The script will be automatically loaded when the component is mounted and removed when the component is unmounted.

## Configuration

Set `manual: true` to have manual control over the timing to load the script.

```ts
import { useScriptTag } from '@vueuse/core'

const { scriptTag, load, unload } = useScriptTag(
  'https://player.twitch.tv/js/embed/v1.js',
  () => {
    // do something
  },
  { manual: true },
)

// manual controls
await load()
await unload()
```
