# useMouse

Reactive mouse position

## Usage

```jsx
import { useMouse } from '@vueuse/core'

export default {
  setup () {
    const { state } = useMouse()

    return { state }
  },
}
```

An example of the state 

```json
{
  "docX": 80,
  "docY": 267,
  "posX": 0,
  "posY": 0,
  "elX": 80,
  "elY": 267,
  "elH": 783.96875,
  "elW": 971
}
```
