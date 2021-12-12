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

const useTemplateRefs = useTemplateRefsWrap<HTMLDivElement>()
const { t1, t2, t3 } = useTemplateRefs(['t1', 't2', 't3'])
//  or do it like this
//  const { t1, t2, t3 } = useTemplateRefsWrap<HTMLDivElement>()(['t1', 't2', 't3'])

//  you can use predefined hooks
const { t4, t5 } = useHtmlElementTemplateRefs(['t4', 't5'])

//  Since 't7' is not declared inside the string array, an error will occur.
//  with "Property 't7' does not exist on type"
const { t6, t7 } = useHtmlElementTemplateRefs(['t6'])

onMounted(() => {
  console.log(t1.value) //  HTMLDivElement
  console.log(t2.value) //  HTMLDivElement
  console.log(t3.value) //  HTMLDivElement
  console.log(t4.value) //  HTMLDivElement
  console.log(t5.value) //  undefinded
  console.log(t6.value) //  undefinded
})
</script>
