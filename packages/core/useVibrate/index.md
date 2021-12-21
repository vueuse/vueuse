---
category: Browser
---

# useVibrate

Reactive vibration web API

Most modern mobile devices include vibration hardware, which lets software 
code provide physical feedback to the user by causing the device to shake. 

The Vibration API offers Web apps the ability to access this hardware, 
if it exists, and does nothing if the device doesn't support it.

## Usage

Vibration is described as a pattern of on-off pulses, which may be of varying 
lengths. 

N.B. The pattern may consist of either a single integer, describing the 
number of milliseconds to vibrate, or an array of integers describing 
a pattern of vibrations and pauses.

```ts
import { useVibrate } from '@vueuse/core'

// This vibrates the device for 300 ms, then pauses for 100 ms before vibrating the device again for another 300 ms:
const { start, stop, persistentStart } = useVibrate({ pattern: [300, 100, 300] })

// Start the vibation, it will automatically stop when the pattern is complete:
start()

// But if you want to stop it, you can:
stop()

// You can also start the vibration every second:
startPersistent()

// Or at a specific interval (e.g., every 3 seconds)
interval.value = 3000

startPersistent()
```

```ts
import { useVibrate } from '@vueuse/core'

// This vibrates the device for 300 ms, then pauses for 100 ms before vibrating the device again for another 300 ms:
const { start, stop, persistentStart } = useVibrate(
  { 
    pattern: [500, 100, 500],
    interval: 3000 
  }
)

// Calling startPersistent will now run the vibrate pattern every 3 seconds:
startPersistent()
```