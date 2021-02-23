---
category: '@Integrations'
---

# useAxios

wrapper for [`axios`](https://github.com/axios/axios)

## Install 

```bash
npm i axios
```

## Usage

```ts
import { useAxios } from '@vueuse/integrations'

const { data, finished } = useAxios('/api/posts')
```

or use an instance of axios

```ts
import axios from 'axios'
import { useAxios } from '@vueuse/integrations'

const instance = axios.create({
  baseUrl: '/api'
})

const { data, finished } = useAxios('/posts', instance)
```

use an instance of axios with config options

```ts
import axios from 'axios'
import { useAxios } from '@vueuse/integrations'

const instance = axios.create({
  baseUrl: '/api'
})

const { data, finished } = useAxios('/posts', { method: 'POST' }, instance)
```

<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Wrapper for axios.
 *
 * @see   {@link https://vueuse.org/useAxios}
 * @param url
 * @param config
 */
export declare function useAxios<T = any>(
  url: string,
  config?: AxiosRequestConfig
): {
  response: Ref<AxiosResponse<T> | undefined>
  data: Ref<T | undefined>
  error: Ref<AxiosError<T> | undefined>
  finished: Ref<boolean>
  cancel: (message?: string | undefined) => void
  canceled: Ref<boolean>
}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/integrations/useAxios/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/integrations/useAxios/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/integrations/useAxios/index.md)


<!--FOOTER_ENDS-->
