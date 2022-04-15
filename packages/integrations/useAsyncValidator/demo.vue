<script setup lang="ts">
import { reactive } from 'vue'
import type { Rules } from 'async-validator'
import { UseAsyncValidator } from './component'
import { useAsyncValidator } from '.'

const form = reactive({ email: '', name: '', age: '' })
const rules: Rules = {
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
  email: [
    {
      type: 'email',
      required: true,
    },
  ],
}

const { pass, isFinished, errorFields } = useAsyncValidator(form, rules)
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

  <div class="bg-base border-main rounded shadow max-w-96 p-8">
    <div>
      email:
      <input
        v-model="form.email" :class="{ '!border-red': errorFields.email?.length > 0 }" type="text"
        placeholder="email"
      >
      <div v-if="errorFields.email?.length > 0" text-red>
        {{ errorFields.email[0].message }}
      </div>
    </div>
    <div>
      name:
      <input
        v-model="form.name" :class="{ '!border-red': errorFields.name?.length > 0 }" type="text"
        placeholder="name"
      >
      <div v-if="errorFields.name?.length > 0" text-red>
        {{ errorFields.name[0].message }}
      </div>
    </div>
    <div>
      age:
      <input
        v-model="form.age" :class="{ '!border-red': errorFields.age?.length > 0 }" type="number"
        placeholder="age"
      >
      <div v-if="errorFields.age?.length > 0" text-red>
        {{ errorFields.age[0].message }}
      </div>
    </div>
    <button :disabled="!pass">
      submit
    </button>
  </div>
</template>
