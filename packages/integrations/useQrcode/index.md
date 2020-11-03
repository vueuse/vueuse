# useQRCode

> wrapper for [`qrcode`](https://github.com/soldair/node-qrcode)

## Install 

```bash
npm i qrcode
```

## Usage

```ts
import { useQRCode } from '@vueuse/integrations'

// `qrcode` will be a ref of data url
const qrcode = useQRCode('vueuse')
```

or passing a `ref` to it

```ts
import { ref } from 'vue'
import { useQRCode } from '@vueuse/integrations'

const text = ref('vueuse')
const qrcode = useQRCode(text)
```

```html
<input v-model="text" >
<img :src="qrcode" />
```
