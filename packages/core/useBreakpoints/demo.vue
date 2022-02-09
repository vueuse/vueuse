<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '.'

const breakpoints = useBreakpoints(breakpointsTailwind)

const sm = breakpoints.smaller('sm')
const md = breakpoints.between('sm', 'md')
const lg = breakpoints.between('md', 'lg')
const xl = breakpoints.between('lg', 'xl')
const xxl = breakpoints.between('xl', '2xl')
const xxxl = breakpoints['2xl']
</script>

<template>
  <div class="font-mono">
    <div> sm: <BooleanDisplay :value="sm" /></div>
    <div> md: <BooleanDisplay :value="md" /></div>
    <div> lg: <BooleanDisplay :value="lg" /></div>
    <div> xl: <BooleanDisplay :value="xl" /></div>
    <div>2xl: <BooleanDisplay :value="xxl" /></div>
    <div>3xl: <BooleanDisplay :value="xxxl" /></div>
  </div>
</template>
