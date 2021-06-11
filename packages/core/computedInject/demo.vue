<script lang="ts">
import { defineComponent, provide, ref } from 'vue-demi'
import Receiver, { ArrayKey } from './demoReceiver.vue'

const Provider = defineComponent({
  components: {
    Receiver,
  },
  setup() {
    const array = ref([{ key: 1, value: '1' }, { key: 2, value: '2' }, { key: 3, value: '3' }])

    provide(ArrayKey, array)

    return {
      array,
    }
  },
})

export default Provider

</script>

<template>
  <div>
    <p>Array: {{ array }}</p>
    <Receiver />
  </div>
</template>
