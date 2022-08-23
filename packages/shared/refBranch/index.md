---
category: Reactivity
---

# refBranch
 watch source value  update branchRef and  user can also modify branchRef value
 scene:Applies to initial values
## Usage

```ts
import { refBranch } from '@vueuse/core'
const source = ref('maybe father props')
const childRef = refBranch(source, 'defaultValue')
console.log(childRef.value) // 'maybe father props'

childRef.value = 'you can modify'
console.log(childRef.value) // 'you can modify'

source.value = 'father props change'
// nextTick(() => {
//  console.log(childRef.value)// 'father props change'
// })

source.value = undefined// when value equal undefined/null
// nextTick(() => {
//  console.log(childRef.value)// defaultValue
// })

```
