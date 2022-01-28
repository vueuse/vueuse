---
category: Elements
---

# useLazyload

lazy load the img, picture or video. base on useIntersectionObserver.

## Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useLazyload } from '@vueuse/core'
const target = ref(null)
useLazyload(target)
</script>

<template>
  <div class="root">
    <img ref="target" 
         class="target" 
         alt="it's a VueUse icon" />
  </div>
</template>

```

for use with responsive images
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useLazyload } from '@vueuse/core'
const target = ref(null)
useLazyload(target)
</script>

<template>
  <div class="root">
    <img ref="target" 
         class="target" 
         data-src="/pwa-192x192.png"
         data-srcset="/pwa-192x192.png 1x, /pwa-512x512.png 2x"
         alt="it's a VueUse icon" />
  </div>
</template>
```

for use with background image
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useLazyload } from '@vueuse/core'
const target = ref(null)
useLazyload(target)
</script>

<template>
  <div class="root">
    <div class="target" data-background-image="/pwa-512x512.png"></div>
  </div>
</template>

```

for use with video
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useLazyload } from '@vueuse/core'
const target = ref(null)
useLazyload(target)
</script>

<template>
  <div class="root">
    <video controls ref="target" class="target" width="250">
      <source data-src="https://vjs.zencdn.net/v/oceans.mp4" type="video/mp4">
      <source data-src="https://vjs.zencdn.net/v/oceans.webm" type="video/webm">
    </video>
  </div>
</template>
```

for use with picture
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useLazyload } from '@vueuse/core'
const target = ref(null)
useLazyload(target)
</script>

<template>
  <div class="root">
    <picture data-src="/pwa-512x512.png">
      <img alt="it's a VueUse icon" />
    </picture>
  </div>
</template>

```

