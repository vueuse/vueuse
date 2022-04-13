<script setup lang="ts">
import { reactive } from 'vue'
import { useAsyncValidator } from '.'

const form = reactive({ name: '', age: '' })

const { pass, isFinished, error } = useAsyncValidator(form, {
  name: {
    type: 'string',
    min: 5,
    max: 20,
    required: true,
  },
  age: {
    type: 'number',
    required: true,
  },
})
</script>

<template>
  <div>
    pass:
    <BooleanDisplay :value="pass" />
  </div>
  <div>
    isFinished:
    <BooleanDisplay :value="isFinished" />
  </div>

  <form class="bg-base border-main rounded shadow max-w-96 p-8">
    <div>
      name:
      <input v-model="form.name" :class="{ '!border-red': error?.fields['name']?.length > 0 }" type="text" placeholder="name">
      <div v-if="error?.fields['name']?.length > 0" text-red>
        {{ error?.fields['name'][0].message }}
      </div>
    </div>
    <div>
      age:
      <input v-model="form.age" :class="{ '!border-red': error?.fields['age']?.length > 0 }" type="number" placeholder="age">
      <div v-if="error?.fields['age']?.length > 0" text-red>
        {{ error?.fields['age'][0].message }}
      </div>
    </div>
    <button :disabled="!pass">
      submit
    </button>
  </form>
</template>
