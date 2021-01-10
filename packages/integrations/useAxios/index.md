---
category: '@Integrations'
---

# useAxios

> wrapper for [`axios`](https://github.com/axios/axios)

## Install 

```bash
npm i axios
```

## Usage

```ts
import { useAxios } from '@vueuse/integrations'

const { data, finished } = useAxios('/api/posts')
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Wrapper for axios.
 *
 * @see   {@link https://vueuse.js.org/useAxios}
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

[Source](https://github.com/antfu/vueuse/blob/master/packages/integrations/useAxios/index.ts) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/integrations/useAxios/index.md)


<!--FOOTER_ENDS-->