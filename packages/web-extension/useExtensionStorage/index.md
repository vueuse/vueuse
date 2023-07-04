---
category: '@web-extension'
---

# useExtensionStorage

Reactive [storage](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/local) storage for web extensions.

## Usage

```ts
import { useExtensionStorage } from '@vueuse/web-extension'

const data = useExtensionStorage('data')
console.log(data.value) // print current value
data.value = 2 // change current value, will be synced to extension local storage
```

Change storage type, `local` will be used as default:

```js
import { useExtensionStorage } from '@vueuse/web-extension'

const data = useExtensionStorage('data', 'sync')
console.log(data.value) // print current value
data.value = 2 // change current value, will be synced to extension sync storage
```
