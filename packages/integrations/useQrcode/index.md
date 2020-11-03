# useQrcode

> wrapper for [`qrcode`](https://github.com/soldair/node-qrcode)

> To use this function, you will need to have [`qrcode`](https://github.com/soldair/node-qrcode) installed.

## Usage

```ts
import { useQrcode } from '@vueuse/integrations'

const qrcode = useQrcode('vueuse')
```

or passing a `ref` to it

```ts
import { ref } from 'vue'
import { useQrcode } from '@vueuse/integrations'

const text = ref('vueuse')
const qrcode = useQrcode(text)
```

```html
<input v-model="text" >
<img :src="qrcode" />
```
