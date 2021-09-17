<script setup lang="ts">
import { MaybeRef } from '@vueuse/shared'
import axios from 'axios'
import { Ref, ref } from 'vue-demi'
import { unrefy } from '.'

const hint = ref('')
const url = ref('https://httpbin.org/json')
const data = ref()
const fetch = (url: string | object) => {
  
  const urlString = typeof url === 'string' ? url : JSON.stringify(url)
  hint.value = `Passed argument : '${urlString}'`

  axios.get(url, data)
    .then(res => data.value = res.data)
    .catch(e => { data.value = {}; throw e })
}
const fetchUnrefied = unrefy(fetch)

const _fetch = () => fetch(url)
const _fetchUnrefied = () => fetchUnrefied(url)

// fetch(url, data)           /* ❌ Will throw an error because the argument is not a string */
// fetchUnrefied(url, data)   /* ✔️ Work because the arguments will be "unrefied" */
</script>

<template>
  <div>
    <button @click="_fetchUnrefied">
      Unrefied Fetch
    </button>
    <button @click="_fetch">
      Raw Fetch
    </button>
  </div>
  <pre v-if="hint">{{ hint }}</pre>
  <pre v-if="data">{{ data }}</pre>
</template>
