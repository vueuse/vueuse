---
category: Sensors
---

# useNetwork

Reactive [Network status](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API). The Network Information API provides information about the system's connection in terms of general connection type (e.g., 'wifi', 'cellular', etc.). This can be used to select high definition content or low definition content based on the user's connection. The entire API consists of the addition of the NetworkInformation interface and a single property to the Navigator interface: Navigator.connection.

## Usage

```ts
import { useNetwork } from '@vueuse/core'

const { isOnline, offlineAt, downlink, downlinkMax, effectiveType, saveData, type } = useNetwork()

console.log(isOnline.value)
```

To use as an object, wrap it with `reactive()`

```ts
import { useNetwork } from '@vueuse/core'
// ---cut---
import { reactive } from 'vue'

const network = reactive(useNetwork())

console.log(network.isOnline)
```

## Component Usage

```vue
<template>
  <UseNetwork v-slot="{ isOnline, type }">
    Is Online: {{ isOnline }}
    Type: {{ type }}
  </UseNetwork>
</template>
```
