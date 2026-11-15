<script setup lang="ts">
import { useWebMCP } from '@vueuse/core'
import { shallowRef } from 'vue'

const todos = shallowRef<string[]>([])
const draft = shallowRef('')

const { isSupported, isRegistered, error } = useWebMCP({
  name: 'add-todo',
  description: 'Add a new item to the user\'s active todo list',
  inputSchema: {
    type: 'object',
    properties: {
      text: { type: 'string', description: 'The text content of the todo item' },
    },
    required: ['text'],
  },
  async execute({ text }: { text: string }) {
    todos.value = [...todos.value, text]
    return `Added todo item: "${text}" successfully.`
  },
})

function add() {
  if (!draft.value.trim())
    return
  todos.value = [...todos.value, draft.value.trim()]
  draft.value = ''
}
</script>

<template>
  <div>
    <p>
      Supported: <b>{{ isSupported }}</b>
    </p>
    <p>
      Tool registered: <b>{{ isRegistered }}</b>
    </p>
    <p v-if="error">
      Error: <b>{{ error.message }}</b>
    </p>

    <note>
      When a WebMCP-capable agent is present, it can call the
      <code>add-todo</code> tool to append items below — the same list you edit
      by hand. The tool is unregistered automatically when this demo unmounts.
    </note>

    <form @submit.prevent="add">
      <input v-model="draft" type="text" placeholder="Add a todo…">
      <button type="submit">
        Add
      </button>
    </form>

    <ul>
      <li v-for="(todo, i) in todos" :key="i">
        {{ todo }}
      </li>
    </ul>
  </div>
</template>
