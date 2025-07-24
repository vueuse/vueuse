<script setup lang="ts">
import type { ChangeCaseType } from '@vueuse/integrations/useChangeCase'
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import * as ChangeCase from 'change-case'
import { shallowRef } from 'vue'

const transforms: any = Object.keys(ChangeCase).filter(v => v.endsWith('Case'))
const input = shallowRef('helloWorld')
const type = shallowRef<ChangeCaseType>(transforms[0])
const changeCase = useChangeCase(input, type)
</script>

<template>
  <div>
    <label v-for="item in transforms" :key="item" class="radio">
      <input v-model="type" :value="item" type="radio">
      <span>{{ item }}</span>
    </label>
  </div>
  <input v-model="input" type="text">
  <pre lang="yaml">{{ changeCase }}</pre>
</template>

<style scoped>
.radio {
  width: 9rem;
  margin-left: 0.5rem;
}
</style>
