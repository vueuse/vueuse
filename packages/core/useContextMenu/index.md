---
category: Sensors
---

# useContextMenu

Open a context menu on an element.

## Usage

```html
<script setup lang="ts">
import { ref} from 'vue'
import { useContextMenu } from '@vueuse/core'

const el = ref<HTMLElement>(null)

useContextMenu(el, 
[
    {
      text:"Red",
      handler(){
        el.value.style.backgroundColor = "red"
      }
    },
    {
      text:"Green",
      handler(){
        el.value.style.backgroundColor = "green"
      }
    }
  ],
);
</script>

<template>
    <div ref="el">
        <p>Right click me</p>
    </div>
</template>
```
