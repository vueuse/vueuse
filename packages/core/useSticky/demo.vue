<script setup lang="ts">
import { ref } from 'vue-demi'
import { UseSticky as USticky } from './component'
import { useSticky } from '.'

const el = ref<HTMLElement | null>(null)

const { isFixed } = useSticky(el, { offsetTop: 100 })

</script>

<template>
  <u-sticky
    v-slot="{isFixed}"
    :offset-top="50"
  >
    <div class="w-300px h-100px bg-gray-500/60 flex justify-center items-center">
      Sticky State (Component): {{ isFixed }}
    </div>
  </u-sticky>

  <div ref="el" class="w-300px h-100px bg-blue-500/60 flex justify-center items-center">
    Sticky State (Hook) : {{ isFixed }}
  </div>
</template>
