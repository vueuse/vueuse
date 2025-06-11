<script setup lang="ts">
import { shallowRef } from 'vue'
import { useTemporal } from './index'

const {
  timezone,
  calendar,
  toTimezone,
  toPlainDate,
  toPlainTime,
  toPlainDateTime,
  format,
  add,
  subtract,
  pause,
  resume,
  isActive,
} = useTemporal()

const selectedTimezone = shallowRef('UTC')
const selectedCalendar = shallowRef('gregory')
const durationInput = shallowRef('P1D')

const timezones = [
  { label: 'UTC', value: 'UTC' },
  { label: 'New York', value: 'America/New_York' },
  { label: 'London', value: 'Europe/London' },
  { label: 'Tokyo', value: 'Asia/Tokyo' },
  { label: 'Sydney', value: 'Australia/Sydney' },
]

const calendars = [
  { label: 'Gregorian', value: 'gregory' },
  { label: 'Islamic', value: 'islamic' },
  { label: 'Hebrew', value: 'hebrew' },
  { label: 'Chinese', value: 'chinese' },
  { label: 'Japanese', value: 'japanese' },
]

function updateTimezone() {
  timezone.value = selectedTimezone.value
}

function updateCalendar() {
  calendar.value = selectedCalendar.value
}

function addDuration() {
  try {
    const result = add(durationInput.value)
    console.log('Added duration:', result.toString())
  }
  catch (error) {
    console.error('Invalid duration format')
  }
}

function subtractDuration() {
  try {
    const result = subtract(durationInput.value)
    console.log('Subtracted duration:', result.toString())
  }
  catch (error) {
    console.error('Invalid duration format')
  }
}
</script>

<template>
  <div>
    <!-- Current Time Display -->
    <div text-center mb-6>
      <div text-2xl font-bold text-primary mb-2>
        {{ format() }}
      </div>
      <div text-sm opacity-60 flex justify-center gap-4>
        <span>{{ timezone }}</span>
        <span>{{ calendar }}</span>
        <span>{{ isActive ? 'Active' : 'Paused' }}</span>
      </div>
    </div>

    <!-- Controls -->
    <div flex justify-center mb-6>
      <button
        bg="gray-100 dark:gray-700"
        hover="bg-gray-200 dark:bg-gray-600"
        px-4
        py-2 rounded @click="isActive ? pause() : resume()"
      >
        {{ isActive ? 'Pause' : 'Resume' }}
      </button>
    </div>

    <!-- Timezone Selection -->
    <div mb-6>
      <div text-sm opacity-60 mb-2>
        Timezone
      </div>
      <select
        v-model="selectedTimezone"
        w-full
        p-2 rounded bg="gray-100 dark:gray-700"
        border="1 gray-300 dark:gray-600"
        @change="updateTimezone"
      >
        <option v-for="tz in timezones" :key="tz.value" :value="tz.value">
          {{ tz.label }}
        </option>
      </select>
    </div>

    <!-- Calendar Selection -->
    <div mb-6>
      <div text-sm opacity-60 mb-2>
        Calendar System
      </div>
      <select
        v-model="selectedCalendar"
        w-full
        p-2 rounded bg="gray-100 dark:gray-700"
        border="1 gray-300 dark:gray-600"
        @change="updateCalendar"
      >
        <option v-for="cal in calendars" :key="cal.value" :value="cal.value">
          {{ cal.label }}
        </option>
      </select>
    </div>

    <!-- World Clock -->
    <div mb-6>
      <div text-sm opacity-60 mb-2>
        World Clock
      </div>
      <div grid grid-cols-2 gap-2>
        <div
          v-for="tz in timezones.slice(1, 5)"
          :key="tz.value"
          p-3 rounded
          bg="gray-100 dark:gray-700"
          text-center
        >
          <div text-xs opacity-60>
            {{ tz.label }}
          </div>
          <div text-sm font-mono>
            {{ toTimezone(tz.value).toLocaleString() }}
          </div>
        </div>
      </div>
    </div>

    <!-- Duration Operations -->
    <div mb-6>
      <div text-sm opacity-60 mb-2>
        Duration Operations
      </div>
      <div flex gap-2 mb-2>
        <input
          v-model="durationInput"
          placeholder="P1D, PT2H, P1M"
          flex-1 p-2 rounded
          bg="gray-100 dark:gray-700"
          border="1 gray-300 dark:gray-600"
        >
      </div>
      <div flex gap-2>
        <button
          bg="green-100 dark:green-700"
          hover="bg-green-200 dark:bg-green-600"
          px-3
          py-1 rounded text-sm @click="addDuration"
        >
          Add
        </button>
        <button
          bg="red-100 dark:red-700"
          hover="bg-red-200 dark:bg-red-600"
          px-3
          py-1 rounded text-sm @click="subtractDuration"
        >
          Subtract
        </button>
      </div>
    </div>

    <!-- Format Examples -->
    <div mb-6>
      <div text-sm opacity-60 mb-2>
        Format Examples
      </div>
      <div space-y-2 text-sm font-mono>
        <div>Short: {{ format({ dateStyle: 'short' }) }}</div>
        <div>Long: {{ format({ dateStyle: 'long' }) }}</div>
        <div>Time: {{ format({ timeStyle: 'medium' }) }}</div>
      </div>
    </div>

    <!-- Components -->
    <div>
      <div text-sm opacity-60 mb-2>
        Components
      </div>
      <div space-y-1 text-xs font-mono opacity-70>
        <div>Date: {{ toPlainDate().toString() }}</div>
        <div>Time: {{ toPlainTime().toString() }}</div>
        <div>DateTime: {{ toPlainDateTime().toString() }}</div>
      </div>
    </div>
  </div>
</template>
