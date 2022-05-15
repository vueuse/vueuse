---
category: Browser
---

# useForm
Form state management and validation

## Usage
### Form state management
将 `form` 用 `v-model` 绑定到 `<input>` 或是其他组件, 值改变时 `status` 会产生对应的变化；使用 reset 方法重置表单的值到初始状态
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
### mutable form initial value
`useForm` 的表单初始值可以其它变量或 pinia 的状态，初始值的改变将在表单重置时同步到 `form` 对象中
```ts
const userStore = useUserStore()

const { form, reset } = useForm({
  form: () => ({
    username: userStore.username,
    intro: userStore.intro,
  }),
})

// 初始值的改变将在表单重置时同步到 form 对象中
userStore.setInfo(/** xxx info */)
reset()

// 更新
userStore.intro
form.username
```

### 表单规则校验

用 `rule` 定义字段规则，当值改变时验证会自动执行，验证结果在 `status[key].isError` 和 `status[key].message` 中呈现。如果一个字段有多条规则，可以使用函数数组的方式表示。
> 你可以维护自己的规则集，并在需要使用的地方导入。

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
    // 如果一个字段有多条规则，可以使用数组
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

#### 手动触发校验
```ts
// 表单校验
verify()
// 字段校验
status.username.verify()
```

#### 手动指定错误

```ts
status.username.setError('username has been registered')
```

#### 清除错误
```ts
// 清除字段的错误
status.username.clearError()
// 清除全部错误
clearErrors()
// 重置表单也会清除错误
reset()
```

### 在表单中展示错误
一些表单值展示时的建议：
1. 使用 `@submit.prevent` 而不是 `@submit`，可以屏蔽表单默认提交行为
2. 判断 `isError` 的值动态的给表单添加红色描边
3. 使用 `&nbsp;` 来避免没有 message 时 `<p>`出现高度塌陷
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
