---
category: Browser
---

# useVibrate

Reactive vibration web API

Most modern mobile devices include vibration hardware, which lets software 
code provides physical feedback to the user by causing the device to shake. 

The Vibration API offers Web apps the ability to access this hardware, 
if it exists, and does nothing if the device doesn't support it.

## Usage

Vibration is described as a pattern of on-off pulses, which may be of varying 
lengths. 

The pattern may consist of either a single integer describing the 
number of milliseconds to vibrate, or an array of integers describing 
a pattern of vibrations and pauses.

```ts
import { useVibrate } from '@vueuse/core'

// This vibrates the device for 300 ms
// then pauses for 100 ms before vibrating the device again for another 300 ms:
const { vibrate, stop, isSupported } = useVibrate({ pattern: [300, 100, 300] })

// Start the vibration, it will automatically stop when the pattern is complete:
vibrate()

// But if you want to stop it, you can:
stop()
```
