---
category: Browser
---

# usePermission

Reactive [Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API). The Permissions API provides the tools to allow developers to implement a better user experience as far as permissions are concerned.

## Usage

```js
import { usePermission } from '@vueuse/core'

const microphoneAccess = usePermission('microphone')
```
