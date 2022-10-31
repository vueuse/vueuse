<script lang="ts">
import { type PropType, defineComponent, inject, ref } from 'vue-demi'
import type { UseConfirmDialogReturn } from '@vueuse/core'

export default defineComponent({
  name: 'ChildModal',
  props: {
    token: {
      required: true,
      type: Symbol as PropType<UseConfirmDialogReturn<any, any, any >['token']>,
    },
  },
  setup(props) {
    const { isRevealed, confirm, cancel } = inject(props.token)!

    return { isRevealed, confirm, cancel }
  },
})
</script>

<template>
  <div v-if="isRevealed" class="child-modal">
    <div>
      <div>
        <p>Confirm or cancel from child</p>
      </div>
      <footer>
        <button @click="confirm">
          OK
        </button>
        <button @click="cancel">
          Cancel
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.child-modal {

}
</style>
