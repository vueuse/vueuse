---
category: Utilities
---

# useSelections

Multiple selection controller.

## Usage


```html
<script setup lang="ts">

import { useSelections } from '@vueuse/core'

const data = [1, 2, 3, 4, 5]
const { selected, noneSelected, allSelected, partiallySelected, isSelected, toggle, selectAll, unSelectAll } = useSelections(data, [1, 2, 3])

</script>
```