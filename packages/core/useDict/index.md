---
category: State
---

# useDict

use a dictionary object keys and values

## Usage

```ts
import { useDict, useDictHelper } from '@vueuse/core'

const { setDictData } = useDictHelper()

const source = {
  status: [
    { label: '启用', value: '1' },
    { label: '关闭', value: '0' },
  ],
  gender: [
    { label: '男', value: '1' },
    { label: '女', value: '0' },
  ],
}
setDictData(source)
const [statusDict, genderDict] = useDict(['status', 'gender'])
```

```vue
<template>
  <div>
    <div>status get : {{ statusDict.get() }}</div>
    <div>gender get :{{ genderDict.get() }}</div>
    <div>status getKey 0: {{ statusDict.getKey('0') }}</div>
    <div>gender getKey 1: {{ genderDict.getKey('1') }}</div>
    <div>gender getValue 女: {{ genderDict.getValue('女') }}</div>
    <div>status getValue 启用: {{ statusDict.getValue('启用') }}</div>
    <div>status getValues 启用,关闭: {{ statusDict.getValues('启用,关闭') }}</div>
    <div>gender getKeys 0,1: {{ genderDict.getKeys('0,1') }}</div>
  </div>
</template>
```
