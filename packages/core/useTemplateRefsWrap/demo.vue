<template>
  <div ref="t1">
    t1
  </div>
  <div ref="t2">
    t2
  </div>
  <div ref="t3">
    t3
  </div>
  <div ref="t4">
    t4
  </div>
  <note>Open the console to see the output</note>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHtmlElementTemplateRefs, useTemplateRefsWrap } from './index'

const useTemplateRef = useTemplateRefsWrap<HTMLDivElement>()
const { t1, t2, t3 } = useTemplateRef(['t1', 't2', 't3'])
//  or do it like this
//  const { t1, t2, t3 } = useTemplateRefsWrap<HTMLDivElement>()(['t1', 't2', 't3'])

const { t4, t5 } = useHtmlElementTemplateRefs(['t4', 't5'])

onMounted(() => {
  console.log(t1.value) //  HTMLDivElement
  console.log(t2.value) //  HTMLDivElement
  console.log(t3.value) //  HTMLDivElement
  console.log(t4.value) //  HTMLDivElement
  console.log(t5.value) //  undefinded
})
</script>
