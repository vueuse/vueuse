---
category: Component
outline: deep
---

# createReusableTemplate

Define and reuse template inside the component scope.


## Motivation

It's common to have the need to reuse some part of the template. For example:

```html
<template>
  <dialog v-if="showInDialog">
    <!-- something complex -->
  </dialog>
  <div v-else>
    <!-- something complex -->
  </div>
</template>
```

We'd like to reuse our code as much as possible. So normally we might need to extract those duplicated parts into a component. However, in a separated component you lose the ability to access the local bindings. Defining props and emits for them can be tedious sometime.

So this function is made to provide a way for defining and reusing templates inside the component scope.

## Usage

In the previous example, we could refactor it to:

```html
<script setup>
import { createReusableTemplate } from '@vueuse/core'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()
</script>

<template>
  <DefineTemplate>
    <!-- something complex -->
  </DefineTemplate>

  <dialog v-if="showInDialog">
    <ReuseTemplate />
  </dialog>
  <div v-else>
    <ReuseTemplate />
  </div>
</template>
```

- `<DefineTemplate>` will register the template and renders nothing.
- `<ReuseTemplate>` will render the template provided by `<DefineTemplate>`.
- `<DefineTemplate>` must be used before `<ReuseTemplate>`.

> **Note**: It's recommended to extract as separate components whenever possible. Abusing this function might lead to bad practices for your codebase.

### Options API

When using with [Options API](https://vuejs.org/guide/introduction.html#api-styles), you will need to define `createReusableTemplate` outside of the component setup and pass to the `components` option in order to use them in the template.

```html
<script>
import { defineComponent } from 'vue'
import { createReusableTemplate } from '@vueuse/core'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()

export default defineComponent({
  components: {
    DefineTemplate,
    ReuseTemplate,
  },
  setup() {
    // ...
  },
})
</script>

<template>
  <DefineTemplate v-slot="{ data, msg, anything }">
    <div>{{ data }} passed from usage</div>
  </DefineTemplate>

  <ReuseTemplate :data="data" msg="The first usage" />
</template>
```

### Passing Data

You can also pass data to the template using slots:

- Use `v-slot="..."` to access the data on `<DefineTemplate>`
- Directly bind the data on `<ReuseTemplate>` to pass them to the template

```html
<script setup>
import { createReusableTemplate } from '@vueuse/core'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()
</script>

<template>
  <DefineTemplate v-slot="{ data, msg, anything }">
    <div>{{ data }} passed from usage</div>
  </DefineTemplate>

  <ReuseTemplate :data="data" msg="The first usage" />
  <ReuseTemplate :data="anotherData" msg="The second usage" />
  <ReuseTemplate v-bind="{ data: something, msg: 'The third' }" />
</template>
```

### TypeScript Support

`createReusableTemplate` accepts a generic type to provide type support for the data passed to the template:

```html
<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core'

// Comes with pair of `DefineTemplate` and `ReuseTemplate`
const [DefineFoo, ReuseFoo] = createReusableTemplate<{ msg: string }>()

// You can create multiple reusable templates
const [DefineBar, ReuseBar] = createReusableTemplate<{ items: string[] }>()
</script>

<template>
  <DefineFoo v-slot="{ msg }">
    <!-- `msg` is typed as `string` -->
    <div>Hello {{ msg.toUpperCase() }}</div>
  </DefineFoo>

  <ReuseFoo msg="World" />

  <!-- @ts-expect-error Type Error! -->
  <ReuseFoo :msg="1" />
</template>
```

Optionally, if you are not a fan of array destructuring, the following usages are also legal:

```html
<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core'

const {
  define: DefineFoo,
  reuse: ReuseFoo,
} = createReusableTemplate<{ msg: string }>()
</script>

<template>
  <DefineFoo v-slot="{ msg }">
    <div>Hello {{ msg.toUpperCase() }}</div>
  </DefineFoo>

  <ReuseFoo msg="World" />
</template>
```

```html
<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core'

const TemplateFoo = createReusableTemplate<{ msg: string }>()
</script>

<template>
  <TemplateFoo.define v-slot="{ msg }">
    <div>Hello {{ msg.toUpperCase() }}</div>
  </TemplateFoo.define>

  <TemplateFoo.reuse msg="World" />
</template>
```

::: warning
Dot notation is not supported in Vue 2.
:::

::: warning
Passing boolean props without `v-bind` is not supported. See the [Caveats](#boolean-props) section for more details.
:::

### Passing Slots

It's also possible to pass slots back from `<ReuseTemplate>`. You can access the slots on `<DefineTemplate>` from `$slots`:

```html
<script setup>
import { createReusableTemplate } from '@vueuse/core'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()
</script>

<template>
  <DefineTemplate v-slot="{ $slots, otherProp }">
    <div some-layout>
      <!-- To render the slot -->
      <component :is="$slots.default" />
    </div>
  </DefineTemplate>

  <ReuseTemplate>
    <div>Some content</div>
  </ReuseTemplate>
  <ReuseTemplate>
    <div>Another content</div>
  </ReuseTemplate>
</template>
```

::: warning
Passing slots does not work in Vue 2.
:::

## Caveats

### Boolean props

As opposed to Vue's behavior, props defined as `boolean` that were passed without `v-bind` or absent will be resolved into an empty string or `undefined` respectively:

```html
<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{
  value?: boolean
}>()
</script>

<template>
  <DefineTemplate v-slot="{ value }">
    {{ typeof value }}: {{ value }}
  </DefineTemplate>

  <ReuseTemplate :value="true" />
  <!-- boolean: true -->

  <ReuseTemplate :value="false" />
  <!-- boolean: false -->

  <ReuseTemplate value />
  <!-- string: -->

  <ReuseTemplate />
  <!-- undefined: -->
</template>
```

## References

This function is migrated from [vue-reuse-template](https://github.com/antfu/vue-reuse-template).

Existing Vue discussions/issues about reusing template:

- [Discussion on Reusing Templates](https://github.com/vuejs/core/discussions/6898)

Alternative Approaches:

- [Vue Macros - `namedTemplate`](https://vue-macros.sxzz.moe/features/named-template.html)
- [`unplugin-@vueuse/core`](https://github.com/liulinboyi/unplugin-@vueuse/core)
