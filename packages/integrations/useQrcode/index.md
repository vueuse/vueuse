# useQRCode

> wrapper for [`qrcode`](https://github.com/soldair/node-qrcode)

## Install 

```bash
npm i qrcode
```

## Usage

```ts
import { useQRCode } from '@vueuse/integrations'

// `qrcode` will be a ref of dataURL
const qrcode = useQRCode('text-to-encode')
```

or passing a `ref` to it, the returned dataURL ref will change along with the source ref's changes.

```ts
import { ref } from 'vue'
import { useQRCode } from '@vueuse/integrations'

const text = ref('text-to-encode')
const qrcode = useQRCode(text)
```

```html
<input v-model="text" >
<img :src="qrcode" />
```
