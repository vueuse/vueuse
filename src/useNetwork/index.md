# useNetwork

Reactive network state

Returns:

```json
{
  "online": true,
  "since": "2019-12-24T20:33:24.846Z",
  "downlink": 1.55,
  "effectiveType": "3g",
  "rtt": 400
}
```

## Usage

```jsx
import { useNetwork } from '@vueuse/core'

export default {
  setup () {
    const { online, ...others } = useNetwork()

    return { online }
  },
}
```
