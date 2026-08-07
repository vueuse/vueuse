<script setup lang="ts">
import { useCssSupports } from '@vueuse/core'
import { shallowRef } from 'vue'

const conditionText = shallowRef('display: flex')
const prop = shallowRef('container-type')
const value = shallowRef('scroll-state')

const { isSupported: conditionTextSupported } = useCssSupports(conditionText)
const { isSupported: propValueSupported } = useCssSupports(prop, value)
</script>

<template>
  <div style="display: flex; flex-direction: column;">
    <input v-model="conditionText" name="condition" type="text">
    <span><code>useCssSupports("{{ conditionText }}")</code>: {{ conditionTextSupported }}</span>
    <hr>
    <input v-model="prop" name="prop" type="text"><input v-model="value" name="value" type="text">
    <span><code>useCssSupports("{{ prop }}", "{{ value }}")</code>: {{ propValueSupported }}</span>
  </div>
</template>
