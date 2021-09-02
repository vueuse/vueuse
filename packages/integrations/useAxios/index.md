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
import { useAxios } from '@vueuse/integrations/useAxios'

const { data, isFinished } = useAxios('/api/posts')
```

or use an instance of axios

```ts
import axios from 'axios'
import { useAxios } from '@vueuse/integrations/useAxios'

const instance = axios.create({
  baseURL: '/api'
})

const { data, isFinished } = useAxios('/posts', instance)
```

use an instance of axios with config options

```ts
import axios from 'axios'
import { useAxios } from '@vueuse/integrations/useAxios'

const instance = axios.create({
  baseURL: '/api'
})

const { data, isFinished } = useAxios('/posts', { method: 'POST' }, instance)
```
