---
category: '@Integrations'
---

# useAxios

Wrapper for [`axios`](https://github.com/axios/axios).

## Install

```bash
npm i axios@^1
```

## Usage

```ts
import { useAxios } from '@vueuse/integrations/useAxios'

const { data, isFinished } = useAxios('/api/posts')
```

or use an instance of axios

```ts
import { useAxios } from '@vueuse/integrations/useAxios'
import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
})

const { data, isFinished } = useAxios('/posts', instance)
```

use an instance of axios with config options

```ts
import { useAxios } from '@vueuse/integrations/useAxios'
import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
})

const { data, isFinished } = useAxios('/posts', { method: 'POST' }, instance)
```

When you don't pass the `url`. The default value is `{immediate: false}`

```ts
import { useAxios } from '@vueuse/integrations/useAxios'

const { execute } = useAxios()
execute(url)
```

The `execute` function `url` here is optional, and `url2` will replace the `url1`.

```ts
import { useAxios } from '@vueuse/integrations/useAxios'

const { execute } = useAxios(url1, {}, { immediate: false })
execute(url2)
```

The `execute` function can accept `config` only.

```ts
import { useAxios } from '@vueuse/integrations/useAxios'

const { execute } = useAxios(url1, { method: 'GET' }, { immediate: false })
execute({ params: { key: 1 } })
execute({ params: { key: 2 } })
```

The `execute` function resolves with a result of network request.

```ts
import { useAxios } from '@vueuse/integrations/useAxios'

const { execute } = useAxios()
const result = await execute(url)
```

The `execute` function call will abort prev request(if requesting) and send current request.
the prev `execute` result will be rejected.
every `execute` call will return a new `Promise`

```ts
import { useAxios } from '@vueuse/integrations/useAxios'

const { execute } = useAxios(url1, { method: 'GET' }, { immediate: false })
const result1 = execute(url1)
const result2 = execute(url2)
const result3 = await execute(url3)
```

use an instance of axios with `immediate` options

```ts
import { useAxios } from '@vueuse/integrations/useAxios'
import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
})

const { data, isFinished } = useAxios('/posts', { method: 'POST' }, instance, {
  immediate: false,
})
```
