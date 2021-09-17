---
category: Utilities
---

# unrefy

Convert a plain function into a function that unref it's aguments before every call.
The converted function accepts refs and raw values as its arguments
and returns the same value the unconverted function returns, with proper typing.

::: tip
Make sure you're using the right tool for the job. Using [`reactify`](/core/reactify/)
might be more pertinent in some cases where you want to evaluate the function on each changes of it's
arguments.
:::

## Usage

```ts
import axios from 'axios'
import { ref } from 'vue-demi'
import { unrefy } from '.'

const url = ref('https://httpbin.org/post')
const data = ref({foo: 'bar'})
const post = (url, data) => axios.post(url, data)
const postUnrefied = unrefy(post)

post(url, data)           /* ❌ Will throw an error because the arguments are refs */
postUnrefied(url, data)   /* ✔️ Will Work because the arguments will be "unrefied" */
```

## Related Functions

- `reactify`
