<script setup lang="ts">
import { ref } from 'vue'
import { useElementVisibility } from '@vueuse/core'

const el = ref(null)
const isVisible = useElementVisibility(el)

const scrollTarget = ref(null)
const elWithTarget = ref(null)
const isVisibleWithTarget = useElementVisibility(elWithTarget, { scrollTarget })
</script>

<template>
  <div>
    <note class="mb-2">
      Info on the right bottom corner
    </note>
    <div ref="el" class="max-w-100 relative area bg-white dark:bg-gray-800 shadow-lg z-60">
      Target Element (scroll down the window)
    </div>
  </div>
  <div class="float m-3 area shadow-lg">
    Element
    <BooleanDisplay
      :value="isVisible"
      true="inside"
      false="outside"
      class="font-bold"
    />
    the viewport
  </div>
  <div h="1px" bg="$vp-c-divider-light" m="block-4" />
  <!-- with scrollTarget -->
  <note class="mb-2">
    Visibility within `scrollTarget`
  </note>
  <div ref="scrollTarget" overflow-y-scroll h-50 shadow-md my-2 border="2px dashed #ccc">
    <div :bg="`${isVisibleWithTarget ? 'green' : 'amber'} op-10`" class="h-200 relative flow-root">
      <p text-center p-5 text-xl>
        Scroll me down!
      </p>
      <div ref="elWithTarget" class="max-w-100 absolute left-[50%] translate-x-[-50%] top-60 area bg-white dark:bg-gray-800 shadow-lg z-60">
        Element within scrollTarget
      </div>
      <p w="100%" text-center pt-4 text-xl absolute bottom-2>
        Scroll me up!
      </p>
    </div>
  </div>
  <div text-center>
    Element
    <BooleanDisplay
      :value="isVisibleWithTarget"
      true="inside"
      false="outside"
      class="font-bold"
    />
    the <span font-bold>`scrollTarget` </span>
  </div>
</template>
