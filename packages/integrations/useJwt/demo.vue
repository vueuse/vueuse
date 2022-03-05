<template>
  <div>
    <p>Header</p>
    <pre lang="json" class="ml-2">{{ JSON.stringify(header, null, 2) }}</pre>
    <p>Payload</p>
    <pre lang="json" class="ml-2">{{ JSON.stringify(payload, null, 2) }}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import { useJwt } from '@vueuse/core'

export default defineComponent({
  setup() {
    const encodedJwt = ref('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.L8i6g3PfcHlioHCCPURC9pmXT7gdJpx3kOoyAfNUwCc')
    const { header, payload } = useJwt(encodedJwt)

    return { header, payload }
  },
})

</script>
