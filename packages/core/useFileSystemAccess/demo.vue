<script setup lang="ts">
import { useFileSystemAccess } from '.'

const res = useFileSystemAccess({
  dataType: 'Text',
  types: [{
    description: 'text',
    accept: {
      'text/plain': ['.txt', '.html'],
    },
  }],
  excludeAcceptAllOption: true,
})

const content = res.data

async function onSave() {
  await res.save()
  alert('saved')
}
</script>

<template>
  <div>
    <button @click="res.create()">
      new file
    </button>
    <button @click="res.open()">
      open
    </button>
    <button
      @click="onSave"
    >
      save
    </button>

    <div>
      <textarea v-model="content" rows="20" cols="40" />
    </div>
  </div>
</template>
