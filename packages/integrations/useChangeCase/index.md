---
category: '@Integrations'
---

# useChangeCase

Reactive wrapper for [`change-case`](https://github.com/blakeembrey/change-case).

Subsitutes `useCamelCase`, `usePascalCase`, `useSnakeCase`, `useSentenceCase`, `useCapitalize`, etc.

## Install

```bash
npm i change-case
```

## Usage

```ts
import { useChangeCase } from '@vueuse/integrations/useChangeCase'

// `changeCase` will be a computed
const changeCase = useChangeCase('hello world', 'camelCase')
changeCase.value // helloWorld
changeCase.value = 'vue use'
changeCase.value // vueUse
// Supported methods
// export {
//   camelCase,
//   capitalCase,
//   constantCase,
//   dotCase,
//   headerCase,
//   noCase,
//   paramCase,
//   pascalCase,
//   pathCase,
//   sentenceCase,
//   snakeCase,
// } from 'change-case'
```

or passing a `ref` to it, the returned `computed` will change along with the source ref's changes.

Can be passed into `options` for customization

```ts
import { ref } from 'vue'
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
const input = ref('helloWorld')
const changeCase = useChangeCase(input, 'camelCase', {
  delimiter: '-',
})
changeCase.value // hello-World
ref.value = 'vue use'
changeCase.value // vue-Use
```
