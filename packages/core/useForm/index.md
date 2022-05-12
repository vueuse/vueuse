---
category: Browser
---

# useForm
Simplify form operations

## Usage
```ts
const { form, error, reset, onSubmit } = useForm({
  // Initial form value
  form: () => ({
    age: '',
  }),
  // Verification rules
  rule: () => ({
    age: [
      // required
      val => !!val || t('required'), // i18n support
      // number
      val => !Number.isNaN(val) || 'Expected number',
      // length
      val => val.length < 3 || 'Length needs to be less than 3',
    ],
  }),
})
```

```vue
<template>
  <h3>Please enter your age</h3>
  <form @submit.prevent="onSubmit(mySubmit)">
    <label>
      <input v-model="form.age" type="text">
      <p>{{ error.age }}</p>
    </label>
    <button type="submit">
      Submit
    </button>
    <button type="button" @click="reset">
      Reset
    </button>
  </form>
</template>
```
