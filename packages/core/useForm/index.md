---
category: Browser
---

# useForm
Form state management and validation

## Usage
### Form state management

Use `v-model` to bind `form[key]` on to the `<input>` element or other components.

`status` value will be changed corresponded when the form values have been modified. Use the `reset` function to reset the form values back to its initial states.

```ts
const { form, status, reset } = useForm({
  // Initial form value
  form: () => ({
    username: '',
    password: '',
  }),
})

// whether the username has been modified
status.username.isDirty
// whether the username has been modified
status.password.isDirty

// Reset form, restore form values to default
reset()
```
### Mutable initial value of form

The initial states of `useForm` could be any other variables or pinia states. The changes made to the initial values will be synced into the `form` object when the form has been resetted.

```ts
const userStore = useUserStore()

const { form, reset } = useForm({
  form: () => ({
    username: userStore.username,
    intro: userStore.intro,
  }),
})

// update the value of username and intro properties
userStore.setInfo(/** xxx info */)
// changes made to the `userStore` will be synced into the `form` object,
// when reset is being called
reset()

// these properties will be the values of `userStore` where `setInfo` has been called previously
form.username
form.intro
```

### Validating rules for form

Use `rule` to define the validation rules for form fields. The verification process will be take placed automatically when values of fields have been changed, the validation result will be stored and provided in `status[key].isError` and `status[key].message` properties. If one fields requires more then one rule, it can be declared by using function arrays.

> You can also maintain your rule collections on your own, and import them where they are needed.

```ts
function isRequired(value) {
  if (value && value.trim())
    return true

  return t('required') // i18n support
}

const { form, status, onSubmit, clearErrors } = useForm({
  // Initial form value
  form: () => ({
    name: '',
    age: '',
  }),
  // Verification rules
  rule: () => ({
    name: isRequired,
    // If one fields requires more then one rule, it can be declared by using function arrays.
    age: [
      isRequired,
      // is number
      val => !Number.isNaN(val) || 'Expected number',
      // max length
      val => val.length < 3 || 'Length needs to be less than 3',
    ],
  }),
})

function mySubmit() {
  alert(`Age: ${form.age} \n Name: ${form.name}`)
}
```

In addition, you can use any reactive values in the validation error message, such as the `t('required')` function call from `vue-i18n` as the examples shown above.

#### Manually trigger the validation

```ts
// validate the form
verify()
// validate individual fields
status.username.verify()
```

#### Manually specify error message

```ts
status.username.setError('username has been registered')
```

#### Maunally clear the errors

```ts
// clear the error for individual field
status.username.clearError()
// clear all the errors
clearErrors()
// reset will also clear the errors
reset()
```

### Suggestions

Some suggestions:

1. Use `@submit.prevent` instead of `@submit`, this can prevent the submitting action take place by form's default
2. Use `isError` to determine whether to add a red border around the form dynamically
3. Use `&nbsp;` to avoid height collapse of `<p>`  when there is no messages

```vue
<template>
  <h3>Please enter your age</h3>
  <form @submit.prevent="onSubmit(mySubmit)">
    <label>
      <input
        v-model="form.age"
        type="text"
        :class="status.age.isError && '!border-red'"
      >
      <p>{{ error.age || '&nbsp;' }}</p>
    </label>
    <button type="submit">
      Submit
    </button>
  </form>
</template>
```
