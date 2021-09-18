<script setup lang="ts">
import { useRandomString } from '.'
const { randomString, generateRandomString } = useRandomString()
</script>

<template>
  <div>
    <p>Random string: {{ randomString }}</p>

    <button type="button" @click="randomString = generateRandomString()">
      Generator another?
    </button>
  </div>
</template>
