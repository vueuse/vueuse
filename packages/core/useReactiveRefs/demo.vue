<script lang="ts">
import { ref, watch, defineComponent } from 'vue-demi'
import { useReactiveRefs } from '.'

export default defineComponent({
  setup() {
    const text = ref<string>('')
    const $hello = ref<HTMLElement | null>(null)
    const $world = ref<HTMLElement | null>(null)
    useReactiveRefs({ $hello, $world })

    watch([$hello, $world], ([_$hello, _$world]) => {
      text.value += _$hello?.textContent?.trim() ?? ''
      text.value += _$world?.textContent?.trim() ?? ''
    }, { flush: 'post' })

    return {
      text,
    }
  },
})

</script>

<template>
  <div ref="$hello" style="display: none;">
    Hello
  </div>
  <div ref="$world" style="display: none;">
    World
  </div>
  <div>
    Hidden div tags content is: {{ text }}
  </div>
</template>
