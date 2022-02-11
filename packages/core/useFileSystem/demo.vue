<script setup lang="ts">
import { useFileSystem } from '.'

const { content, create, save, open } = useFileSystem()

</script>

<template>
  <div>
    <button @click="create">
      new file
    </button>
    <button @click="open">
      open
    </button>
    <button @click="save">
      save
    </button>

    <div>
      <textarea v-model="content" rows="20" cols="40" />
    </div>
  </div>
</template>
