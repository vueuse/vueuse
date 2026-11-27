<script setup lang="ts">
import { shallowRef } from 'vue'
import { useLocalStorageMap } from '.'

const MAP_LOCAL_STORAGE_KEY = 'MY_MAP'
const originalMap = new Map([['a', '1'], ['b', '2']])
const mapRef = useLocalStorageMap(MAP_LOCAL_STORAGE_KEY, originalMap)

const newKey = shallowRef<string>('')
const newValue = shallowRef<string>('')
function addNewItem() {
  if (newKey.value && newValue.value) {
    mapRef.value.set(newKey.value, newValue.value)
    newKey.value = ''
    newValue.value = ''
  }
}

const deleteKey = shallowRef<string>('')
function deleteItem() {
  console.log('Deleting key:', deleteKey.value)
  if (deleteKey.value && mapRef.value.has(deleteKey.value)) {
    mapRef.value.delete(deleteKey.value)
  }
  else {
    alert('Key not found')
  }
  deleteKey.value = ''
}
</script>

<template>
  <div class="space-y-4">
    <h2>Map from LocalStorage</h2>
    <ul>
      <li v-for="(value, key) in mapRef" :key="key">
        {{ key }}: {{ value }}
      </li>
    </ul>
    <div>
      <input v-model="newKey" type="text" placeholder="New key">
      <input v-model="newValue" type="text" placeholder="New value">
      <button @click="addNewItem">
        Add
      </button>
    </div>
    <div>
      <input v-model="deleteKey" type="text" placeholder="Key to delete">
      <button @click="deleteItem">
        Delete
      </button>
    </div>
  </div>
</template>
