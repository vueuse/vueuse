---
category: Browser
---

# useStyle

Inject reactive `<style>` element in head.

## Usage

### Basic usage

Provide a CSS string, then `useStyle` will automatically generate an id and inject it in `<head>`.
```js
import { useStyle } from '@vueuse/core'

const {
  id,
  css,
  load,
  unload,
  loaded,
} = useStyle('.usestyle-demo { margin-top: 32px; }')

// Later you can modify styles
css.value = '.usestyle-demo { margin-top: 64px; }'
```
This code will be injected in `<head>`:
```html
<style type="text/css" id="usestyle_1">.usestyle-demo { margin-top: 64px; }</style>
```

### Custom ID

If you need to define your own id, you can pass `id` as first argument.
```js
import { useStyle } from '@vueuse/core'

useStyle('demo-styles', '.usestyle-demo { margin-top: 32px; }')
```
```html
<!-- Injected in head: -->
<style type="text/css" id="demo-styles">.usestyle-demo { margin-top: 64px; }</style>
```

### Media query

You can pass media attributes as last argument within object.
```js
useStyle('.usestyle-demo { margin-top: 32px; }', { media: 'print' })
```
```html
<!-- Injected in head: -->
<style type="text/css" id="usestyle_1" media="print">.usestyle-demo { margin-top: 64px; }</style>
```

With custom id:
```js
useStyle('demo-styles', '.usestyle-demo { margin-top: 32px; }', { media: 'print' })
```
```html
<!-- Injected in head: -->
<style type="text/css" id="demo-styles" media="print">.usestyle-demo { margin-top: 64px; }</style>
```
