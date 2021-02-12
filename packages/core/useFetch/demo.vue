<script setup lang="ts">
import { reactive, ref } from 'vue-demi'
import { stringify } from '@vueuse/docs-utils'
import { useToggle } from '@vueuse/shared'
import { useFetch } from '.'

const url = ref('https://httpbin.org/get')
const autoRefetch = ref(false)

const toggleRefetch = useToggle(autoRefetch)

const { isFinished, canAbort, isFetching, status, error, data, execute, abort } = useFetch(url, { method: 'GET' }, { autoFetch: false, autoRefetch })

const text = stringify(reactive({
  isFinished,
  isFetching,
  canAbort,
  status,
  error,
  data,
}))

</script>

<template>
  <div>
    <div>
      <note>The following URLs can be used to test different features of useFetch</note>
      <div class="mt-2">
        Normal Request:
        <code>
          https://httpbin.org/get
        </code>
      </div>
      <div>
        Abort Request:
        <code>
          https://httpbin.org/delay/10
        </code>
      </div>
      <div>
        Response Error:
        <code>
          http://httpbin.org/status/500
        </code>
      </div>
    </div>

    <input v-model="url" type="text">
    <button @click="execute">
      Execute
    </button>
    <button @click="toggleRefetch">
      <carbon-checkmark v-if="autoRefetch" />
      <carbon-error v-else />

      <span class="ml-2">{{ autoRefetch ? 'Autrefetch On': 'Autrefetch Off' }}</span>
    </button>
    <button v-if="canAbort" class="orange" @click="abort">
      Abort
    </button>
    <pre lang="yaml">{{ text }}</pre>
  </div>
</template>
