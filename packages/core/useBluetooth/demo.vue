<script setup lang="ts">
import { useBluetooth } from '.'

const {
  isConnected,
  isSupported,
  device,
  requestDevice,
  error,
} = useBluetooth({
  acceptAllDevices: true,
})
</script>

<template>
  <div class="grid grid-cols-1 gap-x-4 gap-y-4">
    <div>{{ isSupported ? 'Bluetooth Web API Supported' : 'Your browser does not support the Bluetooth Web API' }}</div>

    <div v-if="isSupported">
      <button @click="requestDevice()">
        Request Bluetooth Device
      </button>
    </div>

    <div v-if="device">
      <p>Device Name: {{ device.name }}</p>
    </div>

    <div v-if="isConnected" class="bg-green-500 text-white p-3 rounded-md">
      <p>Connected</p>
    </div>

    <div v-if="!isConnected" class="bg-orange-800 text-white p-3 rounded-md">
      <p>Not Connected</p>
    </div>

    <div v-if="error">
      <div>Errors:</div>
      <pre>
      <code class="block p-5 whitespace-pre">{{ error }}</code>
    </pre>
    </div>
  </div>
</template>
