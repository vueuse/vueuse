---
category: '@Integrations'
---

# useQRCode

wrapper for [`qrcode`](https://github.com/soldair/node-qrcode)

## Install 

```bash
npm i qrcode
```

## Usage

```ts
import { useQRCode } from '@vueuse/integrations'

// `qrcode` will be a ref of data URL
const qrcode = useQRCode('text-to-encode')
```

or passing a `ref` to it, the returned data URL ref will change along with the source ref's changes.

```ts
import { ref } from 'vue'
import { useQRCode } from '@vueuse/integrations'

const text = ref('text-to-encode')
const qrcode = useQRCode(text)
```

```html
<input v-model="text" type="text">
<img :src="qrcode" />
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Wrapper for qrcode.
 *
 * @see https://vueuse.org/useQRCode
 * @param text
 * @param options
 */
export declare function useQRCode(
  text: MaybeRef<string>,
  options?: QRCode.QRCodeToDataURLOptions
): Ref<string>
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/integrations/useQRCode/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/integrations/useQRCode/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/integrations/useQRCode/index.md)


<!--FOOTER_ENDS-->
