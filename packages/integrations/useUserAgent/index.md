---
category: '@Integrations'
---

# useFuse

Easily implement User Agent parsing using a composable

## Install ua-parser-js as a peer dependency

### NPM

```bash
npm install ua-parser-js@^1
```

### Yarn

```bash
yarn add ua-parser-js
```

## Usage

```ts
import { ref } from 'vue'
import { useUserAgent } from '@vueuse/integrations/useUserAgent'

const ua = useUserAgent(navigator.userAgent)

console.log(ua.getResult())

/*
 * Results:
 *
 * {
 *   "ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36  (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
 *   "browser": {
 *     "name": "Chrome",
 *     "version": "127.0.0.0",
 *     "major": "127"
 *   },
 *   "engine": {
 *     "name": "Blink",
 *     "version": "127.0.0.0"
 *   },
 *   "os": {
 *     "name": "Windows",
 *     "version": "10"
 *   },
 *   "device": {},
 *   "cpu": {
 *     "architecture": "amd64"
 *   }
 * }
 *
 */
```
