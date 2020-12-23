<script setup lang="ts">
import { defineComponent } from 'vue-demi'
import { useCookies } from './index'

const cookies = useCookies(['locale'])

const cookies
</script>

<template>
  <div>
    <p>
      <strong>Cookies Value</strong>: {{ cookies.get('locale') || 'unknown' }}
    </p>
    <pre class="ml-2">{{ JSON.stringify(cookies.getAll(), null, 2) }}</pre>
    <br />
    <note>Change to</note>
    <button @click="cookies.set('locale', 'ru-RU')">Russian</button>
    <button @click="cookies.set('locale', 'en-US')">English</button>
  </div>
</template>
