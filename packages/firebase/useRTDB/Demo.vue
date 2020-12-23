<script setup lang="ts">
import firebase from 'firebase/app'
import { defineComponent } from 'vue-demi'
import { useRTDB } from '.'

const todos = useRTDB(db.ref('todos'))
</script>

<template>
  <div>
    <note>Todos</note>
    <pre>{{ JSON.stringify(todos, null, 2) }}</pre>
  </div>
</template>
