---
category: Elements
---

# useDragIntoElement

Drag draggable element into target element.

## Usage

```html

<script setup lang="ts">

import { ref } from 'vue'
import { useDragIntoElement } from '@vueuse/core'
const dragElement = ref<HTMLElement | null>(null)
const dropElement = ref<HTMLElement | null>(null)

const {top,right, bottom,left,isDragging} = useDragIntoElement(dragElement,dropElement)

```
