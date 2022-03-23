---
category: State
---

# useTouchMove
This hook is only applicable to the mobile terminal. The internal code uses touchevents

Its main function is to monitor the sliding distance and direction of the contact on the screen

## Usage

```js
import { useTouchMove } from '@vueuse/core'
const ele =ref<HTMLElement>()

//disY :move distance  
//directionY : move direction
const {disX,disY,directionX,directionY} = useTouchMove(ele)
```


