---
category: state
---

# useXprovider

- An easy way to manage state
- An intelligent data pass-through method
- Implementing the response data updates by using `provider` and `inject`
- A similar `React.Context` way of Coding
- Implement intelligent, deeper, powerful type inference with the help of `Template Literal Types` and `Infer Keyword`

## Demo

- [demo online](https://codesandbox.io/s/dreamy-sinoussi-zinjvv)
- [repository](https://github.com/phillyx/vue-use-useXprovider)

## Usage

```tsx
// demo.context.tsx
import { useXprovider } from '@vueuse/core'
import { defineComponent } from 'vue'
import DemoApp from './Demo.vue'

interface IDemoState{
  status: boolean
  foo: {
    bar: {
      a: string
    }
  }
}
const demoState = {
  status: false,
} as IDemoState

const DemoContext = useXprovider<IDemoState>(demoState)

export const setDemoState = DemoContext.setState
export const setDemoStateWithStr = DemoContext.setStateWithStr
export const useDemoContext = DemoContext.useContext

export default defineComponent({
  setup() {
    return () => (
      <DemoContext.ProviderComponent>
        <DemoApp></DemoApp>
      </DemoContext.ProviderComponent>
    )
  },
})
```

``` html
// demo.vue
<template>
  <p>status: {{ demoContext.status }}</p>
  <p>foo.bar.a {{ demoContext.foo.bar.a }}</p>
  <button @click="onclick">setSate</button>
  <button @click="onClick1">setStateWithStr</button>
</template>
<script lang="ts" setup>
import { useDemoContext, setDemoState, setDemoStateWithStr } from './demo.context'

const demoContext = useDemoContext()

const onclick = () => {
  setDemoState({ status: true })
}
const onClick1 = () => {
  setDemoState('foo.bar.a', 'hello world')

  setTimeout(() => {
    // equal to
    setDemoStateWithStr('foo.bar.a','hello vue')
  }, 3e3);
}
</script>

```
## Type reference

![图片](https://static01.imgkr.com/temp/b64aa8df0a64451784ed82ea48b6be66.png)
![图片](https://static01.imgkr.com/temp/39c74b60602a4151adfa36695166ada8.png)
![图片](https://static01.imgkr.com/temp/5c2cd70f791a45fa94519d215d15853e.png)

## Reference

- [i-need-to-learn-about-typescript-template-literal-types](https://dev.to/phenomnominal/i-need-to-learn-about-typescript-template-literal-types-51po)

- [how to skillfully use Provider&Inject](https://juejin.cn/post/6887770717430120456)