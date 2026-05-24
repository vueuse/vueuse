<script lang="ts">
import { createReusableTemplate } from './index'

type AcceptableValue
  = | string
    | { label: string, value: string | number | null }
    | null
</script>

<script setup lang="ts" generic="T extends AcceptableValue = AcceptableValue">
const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{
  option: T
}>()
</script>

<template>
  <DefineTemplate #="{ option }">
    <div>{{ option }}</div>
  </DefineTemplate>

  <ReuseTemplate option="value" />
</template>
