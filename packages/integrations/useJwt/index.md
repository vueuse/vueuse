---
category: '@Integrations'
---

# useJwt

wrapper for [`jwt-decode`](https://github.com/auth0/jwt-decode)

## Install

```bash
npm install jwt-decode
```

## Usage

```typescript
import { defineComponent } from 'vue'
import { useJwt } from '@vueuse/integrations'

export default defineComponent({
  setup() {
    const encodedJwt = ref('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.L8i6g3PfcHlioHCCPURC9pmXT7gdJpx3kOoyAfNUwCc')
    const { header, payload } = useJwt(encodedJwt)

    return { header, payload }
  },
})
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Reactive decoced jwt token.
 *
 * @see {@link https://vueuse.js.org/integrations/useJwt/}
 * @param jwt
 */
export declare function useJwt<
  Payload extends object = JwtPayload,
  Header extends object = JwtHeader
>(
  encodedJwt: Ref<string>
): {
  header: ComputedRef<Header>
  payload: ComputedRef<Payload>
}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/master/packages/integrations/useJwt/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/master/packages/integrations/useJwt/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/master/packages/integrations/useJwt/index.md)


<!--FOOTER_ENDS-->
