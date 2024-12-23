<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { ref } from 'vue'

const breakpoints = useBreakpoints(breakpointsTailwind)

const smWidth = breakpointsTailwind.sm

const reactiveStuff = ref<keyof typeof breakpointsTailwind>('sm')
const isGreaterThanBreakpoint = breakpoints.greaterOrEqual(() => reactiveStuff.value)

const current = breakpoints.current()
const active = breakpoints.active()
const xs = breakpoints.smaller('sm')
const xse = breakpoints.smallerOrEqual('sm')
const sm = breakpoints.between('sm', 'md')
const md = breakpoints.between('md', 'lg')
const lg = breakpoints.between('lg', 'xl')
const xl = breakpoints.between('xl', '2xl')
const xxl = breakpoints['2xl']
</script>

<template>
  <div class="font-mono">
    <div> Current breakpoints: {{ current }} </div>
    <div> Active breakpoint: {{ active }} </div>
    <div> xs(&lt;{{ smWidth }}px): <BooleanDisplay :value="xs" /></div>
    <div> xs(&lt;={{ smWidth }}px): <BooleanDisplay :value="xse" /></div>
    <div> sm: <BooleanDisplay :value="sm" /></div>
    <div> md: <BooleanDisplay :value="md" /></div>
    <div> lg: <BooleanDisplay :value="lg" /></div>
    <div> xl: <BooleanDisplay :value="xl" /></div>
    <div>2xl: <BooleanDisplay :value="xxl" /></div>
    <div>greaterThanBreakPoint: <BooleanDisplay :value="isGreaterThanBreakpoint" /></div>
  </div>
</template>
