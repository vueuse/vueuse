<script lang="ts" setup>
import { useForm } from '.'

const { form, status, reset, onSubmit, clearErrors } = useForm({
  // Initial form value
  form: () => ({
    age: '',
  }),
  // Verification rules
  rule: () => ({
    age: [
      /* required */ val => !!val || 'Required',
      /* number */ val => !isNaN(val) || 'Expected number',
      /* length */ val => val.length < 3 || 'Length needs to be less than 3',
    ],
  }),
})

function mySubmit() {
  alert(`Age: ${form.value.age}`)
}
</script>

<template>
  <h3>Please enter your age</h3>

  <form @submit.prevent="onSubmit(mySubmit)">
    <label>
      <input v-model="form.age" type="text">
      <p class="text-red">{{ status.age.message || '&nbsp;' }}</p>
    </label>

    <button type="submit">
      Submit
    </button>

    <button type="button" @click="clearErrors">
      Clear Errors
    </button>

    <button type="button" @click="reset">
      Reset
    </button>
  </form>
</template>
