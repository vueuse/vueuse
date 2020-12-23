<script setup lang="ts">
import { defineComponent } from 'vue-demi'
import { useTitle } from '.'

const title = useTitle(null, { document = window.parent.document })
</script>

<template>
  <div>
    <note>Title</note>
    <input v-model="title" />
  </div>
</template>
