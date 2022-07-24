---
category: '@Integrations'
---

# useJwt

Wrapper for [`jwt-decode`](https://github.com/auth0/jwt-decode).

## Install

```bash
npm install jwt-decode
```

## Usage

```typescript
import { defineComponent } from 'vue'
import { useJwt } from '@vueuse/integrations/useJwt'

export default defineComponent({
  setup() {
    const encodedJwt = ref('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.L8i6g3PfcHlioHCCPURC9pmXT7gdJpx3kOoyAfNUwCc')
    const { header, payload } = useJwt(encodedJwt)

    return { header, payload }
  },
})
```
