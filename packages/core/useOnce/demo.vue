<script setup lang="ts">
import { useOnce } from '@vueuse/core'

const { action, resume, canUse } = useOnce(() => {
  console.log('useOnce')
})

setInterval(() => {
  action()
})
// log: useOnce

// you can change canUse's value to use it again
canUse.value = true
// log: useOnce

// you also can use resume to use it again
resume()
// log: useOnce

// if you don't do anything
// here will log nothing
</script>
