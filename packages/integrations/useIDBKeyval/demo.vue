<script setup lang="ts">
import { stringify } from '@vueuse/docs-utils'
import { useIDBKeyval } from '.'

const KEY = 'vue-use-idb-keyval'

const stateObject = useIDBKeyval(`${KEY}-object`, {
  name: 'Banana',
  color: 'Yellow',
  size: 'Medium',
  count: 0,
})
const textObject = stringify(stateObject)

const stateString = useIDBKeyval(`${KEY}-string`, 'foobar')
const textString = stateString

const stateArray = useIDBKeyval(`${KEY}-array`, ['foo', 'bar', 'baz'])
const textArray = stringify(stateArray)
</script>

<template>
  <h5>Object</h5>
  <input v-model="stateObject.name" type="text">
  <input v-model="stateObject.color" type="text">
  <input v-model="stateObject.size" type="text">
  <input v-model.number="stateObject.count" type="range" min="0" step="0.01" max="1000">

  <pre lang="json">{{ textObject }}</pre>
  <br>

  <h5>String</h5>
  <input v-model="stateString" type="text">
  <pre>{{ textString }}</pre>
  <br>

  <h5>Array</h5>
  <input v-model="stateArray[0]" type="text">
  <input v-model="stateArray[1]" type="text">
  <input v-model="stateArray[2]" type="text">
  <pre lang="json">{{ textArray }}</pre>
</template>
