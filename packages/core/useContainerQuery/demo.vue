<script setup lang="ts">
import { ref } from 'vue-demi'
import { useContainerQuery } from '../useContainerQuery'

const element = ref(null)

const {
  activeBreakpoint,
  width,
} = useContainerQuery({ element })
</script>

<template>
  <div>
    <p>Width: {{ width }}</p>
  </div>
  <note class="mb-2">
    Resize the box to see changes to the element's container query
  </note>
  <textarea ref="element" class="w-full resizer" disabled />

  <div class="font-mono">
    <div>
      sm:
      <BooleanDisplay :value="activeBreakpoint === 'sm'" />
    </div>
    <div>
      md:
      <BooleanDisplay :value="activeBreakpoint === 'md'" />
    </div>
    <div>
      lg:
      <BooleanDisplay :value="activeBreakpoint === 'lg'" />
    </div>
    <div>
      xl:
      <BooleanDisplay :value="activeBreakpoint === 'xl'" />
    </div>
    <div>
      xxl:
      <BooleanDisplay :value="activeBreakpoint === 'xxl'" />
    </div>
  </div>
</template>
