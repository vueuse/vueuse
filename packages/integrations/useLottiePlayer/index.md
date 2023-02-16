---
category: '@Integrations'
---

# useLottiePlayer

Wrapper for lottie-web
## Install 

```bash
npm i lottie-web
```

## Usage



```ts
import { onMounted, ref } from 'vue'
// Json animation file made with AE software
import animJson from './anim.json'
import { useLottiePlayer } from '.'
const anim = ref()
onMounted(() => {
  // `lottieAnim` will be a ref of lottie example
  const lottieAnim = useLottiePlayer(
    {
      container: anim.value,
      loop: true,
      autoplay: true,
      animationData: animJson,
    },
  )

  lottieAnim.value.setSpeed(2)
})
```
The necessary parameter object attributes are lottie's json file (or json's cdn address) and the attached node attributes. Finally, a lottie animation instance is returned with all the methods and attributes of the native lottie-web for use
```html
 <div ref="anim" class="lottie-node" style="height:100px;" />
```
