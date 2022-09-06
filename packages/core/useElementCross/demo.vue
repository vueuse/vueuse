<script setup lang="ts">
import { ref } from 'vue'
import { useElementCross } from '@vueuse/core'

const elOne = ref<HTMLDivElement>()
const elTwo = ref<HTMLDivElement>()

const { isCross, update } = useElementCross(elOne, elTwo)

const flag = ref<boolean>(false)
function onToggle() {
  flag.value = !flag.value
  update()
}
</script>

<template>
  <div relative h-200px>
    <div py-2>
      two element is cross: <span font-bold>{{ isCross }}</span>
    </div>
    <button @click="onToggle">
      click me
    </button>
    <div flex mt-4 :class="flag ? 'space-x-20px' : 'space-x--20px'" text-white select-none>
      <div ref="elOne" w-60px h-60px flex items-center justify-center bg-green op-50>
        one
      </div>
      <div ref="elTwo" w-60px h-60px flex items-center justify-center bg-red op-50>
        two
      </div>
    </div>
  </div>
</template>
