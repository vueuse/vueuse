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

const { data, isFinished } = useAxios('/api/posts')
```

or use an instance of axios

```ts
import axios from 'axios'
import { useAxios } from '@vueuse/integrations'

const instance = axios.create({
  baseURL: '/api'
})

const { data, isFinished } = useAxios('/posts', instance)
```

use an instance of axios with config options

```ts
import axios from 'axios'
import { useAxios } from '@vueuse/integrations'

const instance = axios.create({
  baseURL: '/api'
})

const { data, isFinished } = useAxios('/posts', { method: 'POST' }, instance)
```

<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export interface UseAxiosReturn<T> {
  /**
   * Axios Response
   */
  response: Ref<AxiosResponse<T> | undefined>
  /**
   * Axios response data
   */
  data: Ref<T | undefined>
  /**
   * @deprecated use isFinished instead
   */
  finished: Ref<boolean>
  /**
   * @deprecated use isLoading instead
   */
  loading: Ref<boolean>
  /**
   * Indicates if the request has finished
   */
  isFinished: Ref<boolean>
  /**
   * Indicates if the request is currently loading
   */
  isLoading: Ref<boolean>
  /**
   * @deprecated use aborted instead
   */
  canceled: Ref<boolean>
  /**
   * Indicates if the request was canceled
   */
  aborted: Ref<boolean>
  /**
   * Any erros that may have occurred
   */
  error: Ref<AxiosError<T> | undefined>
  /**
   * @deprecated use abort instead
   */
  cancel: (message?: string | undefined) => void
  /**
   * Aborts the current request
   */
  abort: (message?: string | undefined) => void
}
export declare function useAxios<T = any>(
  url: string,
  config?: AxiosRequestConfig
): UseAxiosReturn<T>
export declare function useAxios<T = any>(
  url: string,
  instance?: AxiosInstance
): UseAxiosReturn<T>
export declare function useAxios<T = any>(
  url: string,
  config: AxiosRequestConfig,
  instance: AxiosInstance
): UseAxiosReturn<T>
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/integrations/useAxios/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/integrations/useAxios/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/integrations/useAxios/index.md)


<!--FOOTER_ENDS-->
