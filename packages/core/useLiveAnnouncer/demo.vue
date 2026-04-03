<script setup lang="ts">
import { useLiveAnnouncer } from '@vueuse/core'
import { shallowRef } from 'vue'

const { announce, polite, assertive, clear } = useLiveAnnouncer()

const message = shallowRef('Your message here')
const count = shallowRef(0)

function handleAnnounce() {
  announce(message.value)
}

function handlePolite() {
  polite(message.value)
}

function handleAssertive() {
  assertive(`Important: ${message.value}`)
}

function handleClear() {
  clear()
}

function incrementCount() {
  count.value++
  polite(`Count is now ${count.value}`)
}
</script>

<template>
  <div class="demo">
    <h2>useLiveAnnouncer Demo</h2>
    <p class="note">
      Turn on your screen reader to hear the announcements!
    </p>

    <div class="input-group">
      <label for="message">Message:</label>
      <input
        id="message"
        v-model="message"
        type="text"
        placeholder="Enter a message"
      >
    </div>

    <div class="button-group">
      <button @click="handleAnnounce">
        Announce (Polite)
      </button>
      <button @click="handlePolite">
        Polite
      </button>
      <button @click="handleAssertive">
        Assertive
      </button>
      <button @click="handleClear">
        Clear
      </button>
    </div>

    <div class="example">
      <h3>Live Example</h3>
      <p>Counter: {{ count }}</p>
      <button @click="incrementCount">
        Increment (announces count)
      </button>
    </div>

    <div class="tips">
      <h3>Usage Tips</h3>
      <ul>
        <li><strong>Polite</strong>: Use for non-critical updates</li>
        <li><strong>Assertive</strong>: Use for critical alerts only</li>
        <li>Keep messages concise</li>
        <li>Avoid frequent announcements</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.demo {
  padding: 1rem;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.input-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.button-group button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button-group button:nth-child(1) {
  background: #3b82f6;
  color: white;
}

.button-group button:nth-child(2) {
  background: #10b981;
  color: white;
}

.button-group button:nth-child(3) {
  background: #ef4444;
  color: white;
}

.button-group button:nth-child(4) {
  background: #6b7280;
  color: white;
}

.example {
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.tips {
  padding: 1rem;
  background: #fef3c7;
  border-radius: 4px;
}

.tips ul {
  margin: 0.5rem 0 0 1.5rem;
}

.note {
  padding: 0.5rem;
  background: #dbeafe;
  border-radius: 4px;
  font-size: 0.9rem;
}
</style>
