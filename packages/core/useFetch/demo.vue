<script setup lang="ts">
import { useFetch } from '@vueuse/core'
import { ref } from 'vue'

const postId = ref(1)
const { data } = useFetch('https://jsonplaceholder.typicode.com/comments', {
  query: { postId },
})

setTimeout(() => {
  postId.value = 2
}, 2000)
</script>

<template>
  <div>
    {{ data }}
    <button @click="postId = postId + 1">
      Increase {{ postId }}
    </button>
  </div>
</template>
