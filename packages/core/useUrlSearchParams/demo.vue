<script setup lang="ts">
import { useUrlSearchParams } from '@vueuse/core'

const params = useUrlSearchParams('history')
params.foo = 'bar'
params.vueuse = 'awesome'

function handleAddParams() {
  params.biz = 'biz'
}
</script>

<template>
  <div>
    <ul class="!m-0">
      <li v-for="key in Object.keys(params)" :key="key">
        {{ key }}={{ params[key] }}
        <input v-model="params[key]" type="text" :placeholder="key">
      </li>
    </ul>

    <button v-if="!params.biz" @click="handleAddParams">
      Add Param
    </button>
  </div>
</template>
