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
export interface JwtOptions<Fallback> {
  /**
   * Value returned when encounter error on decoding
   *
   * @default null
   */
  fallbackValue?: Fallback
  /**
   * Error callback for decoding
   */
  onError?: (error: InvalidTokenError) => void
}
export interface JwtResult<Payload, Header, Fallback> {
  header: ComputedRef<Header | Fallback>
  payload: ComputedRef<Payload | Fallback>
}
/**
 * Reactive decoded jwt token.
 *
 * @see {@link https://vueuse.org/useJwt}
 * @param jwt
 */
export declare function useJwt<
  Payload extends object = JwtPayload,
  Header extends object = JwtHeader,
  Fallback = null
>(
  encodedJwt: MaybeRef<string>,
  options?: JwtOptions<Fallback>
): JwtResult<Payload, Header, Fallback>
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/integrations/useJwt/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/integrations/useJwt/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/integrations/useJwt/index.md)


<!--FOOTER_ENDS-->
