---
category: State
related: useStorage
---

# useLocalStorageMap

Reactive [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) with Map interface.

## Usage

Please refer to `useStorage`.

```js
import { useLocalStorageMap } from '@vueuse/core'

const MAP_LOCAL_STORAGE_KEY = 'MY_MAP'
const originalMap = new Map([['a', '1'], ['b', '2']])
const mapRef = useLocalStorageMap(MAP_LOCAL_STORAGE_KEY, originalMap)

mapRef.set('c', '3') // adds a new entry
mapRef.get('a') // returns '1'
mapRef.has('b') // returns true
mapRef.delete('c') // removes the entry
mapRef.clear() // clears the map
mapRef.size // returns the number of entries in the map
mapRef.value // returns the underlying Map object
mapRef.toJSON() // returns a plain object representation of the map
```
