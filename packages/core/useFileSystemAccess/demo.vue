<script setup lang="ts">
import { useFileSystemAccess } from '.'

const { content, create, save, open } = useFileSystemAccess()

</script>

<template>
  <div>
    <button @click="create">
      new file
    </button>
    <button @click="open">
      open
    </button>
    <button
      @click="save({
        suggestedName:'jelf',
        types: [
          {
            description:'file',
            accept: {
              'image/*' : ['.png','.jpg']
            }
          }
        ],
        excludeAcceptAllOption: true
      })"
    >
      save
    </button>

    <div>
      <textarea v-model="content" rows="20" cols="40" />
    </div>
  </div>
</template>
