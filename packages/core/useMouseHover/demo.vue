<script setup lang="ts">
import { ref } from 'vue'
import { useMouseHover } from '@vueuse/core'
import type { MaybeElementRef } from '../unrefElement'

const el = ref<MaybeElementRef | null>() as MaybeElementRef
const { isHovering } = useMouseHover({ target: el, enterDelay: 200, leaveDelay: 800 })
</script>

<template>
  <h4 style="margin-bottom: 10px;">
    enterDelay: 200ms,leaveDelay: 800ms
  </h4>
  <div ref="el" class="usemousehover-box">
    {{ isHovering }}
  </div>
</template>

<style>
.usemousehover-box{
    width:188px;height:188px;border-radius: 8px;
    background-color: #165dff;color:rgb(22, 210, 172);font-size:28px;
    display:flex;justify-content: center;align-items: center;
}
</style>
