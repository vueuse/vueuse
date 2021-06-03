<script setup lang="ts">
import { reactive, ref } from 'vue-demi'
import { stringify } from '@vueuse/docs-utils'
import { useToggle } from '@vueuse/shared'
import { useFetch } from '.'

const url = ref('https://httpbin.org/get')
const fieldA = ref('')
const fieldB = ref('')
const file = ref<File | null>(null)
const fileField = ref(null)
const refetch = ref(false)
const state = ref(0)

const toggleRefetch = useToggle(refetch)
const go = () => {
  state.value = 0
}
const goWWWFormUrlEncoded = () => {
  state.value = 1
}
const goMultipart = () => {
  state.value = 2
}

const buildFormData = async() => {
  const formData = new FormData()
  formData.append(
    'fieldB',
    new Blob(
      [JSON.stringify({ message: `Multipart B: ${Math.random()}` })],
      { type: 'application/json' },
    ),
    'test-multipart-b.json',
  )
  formData.append(
    'fieldC',
    new Blob(
      [JSON.stringify({ message: `Multipart C: ${Math.random()}` })],
      { type: 'application/json' },
    ),
    'test-multipart-c.json',
  )
  return formData
}

const {
  data,
  error,
  abort,
  statusCode,
  isFetching,
  isFinished,
  canAbort,
  execute,
} = useFetch(url, { refetch }).get()

const text = stringify(reactive({
  isFinished,
  isFetching,
  canAbort,
  statusCode,
  error,
  data,
}))

const {
  data: dataURLEncoded,
  error: errorURLEncoded,
  statusCode: statusCodeURLEncoded,
  isFetching: isFetchingURLEncoded,
  isFinished: isFinishedURLEncoded,
  execute: executeURLEncoded,
} = useFetch(
  'https://httpbin.org/post',
  {
    immediate: false,
    beforeFetch: async() => {
      return {
        options: {
          body: {
            fieldA: fieldA.value,
            fieldB: fieldB.value,
          },
        },
      }
    },
  },
).post(
  null,
  'formEncoded',
)

const textURLEncoded = stringify(reactive({
  isFinishedURLEncoded,
  isFetchingURLEncoded,
  statusCodeURLEncoded,
  errorURLEncoded,
  dataURLEncoded,
}))

const {
  data: dataMultipart,
  error: errorMultipart,
  statusCode: statusCodeMultipart,
  isFetching: isFetchingMultipart,
  isFinished: isFinishedMultipart,
  execute: executeMultipart,
} = useFetch(
  'https://httpbin.org/post',
  {
    immediate: false,
    beforeFetch: async() => {
      const body = await buildFormData()
      if (file.value)
        body.append('fieldA', file.value, file.value.name)

      return {
        options: {
          // we are testing here the header is removed on internal execute call
          headers: { 'Content-Type': 'multipart/form-data' },
          body,
        },
      }
    },
  },
).post(null, 'formData') // <== do not remove it

const textMultipart = stringify(reactive({
  isFinishedMultipart,
  isFetchingMultipart,
  statusCodeMultipart,
  errorMultipart,
  dataMultipart,
}))

const sendMultipartUpload = () => {
  setTimeout(executeMultipart, 0)
}
const updateFile = async() => {
  if (fileField.value.files.length > 0) {
    file.value = fileField.value.files[0]
    if (file.value.size > 10240)
      fileField.value.setCustomValidity('Maximum file size 10KB')
    else
      fileField.value.setCustomValidity('')
  }
  else {
    file.value = null
    fileField.value.setCustomValidity('')
  }
}

</script>

<template>
  <div>
    <template v-if="state === 2">
      <note>Fill the following file input and click on execute button (the execution will add 2 blobs to the file)</note>
      <br>
      <form @submit.prevent="sendMultipartUpload">
        <label for="form-file">Select a file smaller than 10kB : </label>
        <input id="form-file" ref="fileField" placeholder="Field A" type="file" @change="updateFile" />
        <br>
        <button type="submit">
          Execute multipart
        </button>
        <button type="button" @click="go">
          Back
        </button>
      </form>
      <pre lang="yaml">{{ textMultipart }}</pre>
    </template>
    <template v-else-if="state === 1">
      <note>Fill the following fields and click on execute button (you can enter symbols like &amp; or &lt; to see they are encoded)</note>
      <input v-model="fieldA" placeholder="Field A" type="text">
      <input v-model="fieldB" placeholder="Field B" type="text">
      <button @click="executeURLEncoded">
        Execute Form URL Encoded
      </button>
      <button @click="go">
        Back
      </button>
      <pre lang="yaml">{{ textURLEncoded }}</pre>
    </template>
    <template v-else>
      <div>
        <note>The following URLs can be used to test different features of useFetch</note>
        <div class="mt-2">
          Normal Request:
          <code>
            https://httpbin.org/get
          </code>
        </div>
        <div>
          Abort Request:
          <code>
            https://httpbin.org/delay/10
          </code>
        </div>
        <div>
          Response Error:
          <code>
            http://httpbin.org/status/500
          </code>
        </div>
      </div>
      <input v-model="url" type="text">
      <button @click="execute">
        Execute
      </button>
      <button @click="toggleRefetch">
        <carbon-checkmark v-if="refetch" />
        <carbon-error v-else />

        <span class="ml-2">{{ refetch ? 'Refetch On': 'Refetch Off' }}</span>
      </button>
      <button @click="goWWWFormUrlEncoded">
        Test Form URL Encoded
      </button>
      <button @click="goMultipart">
        Test Multipart
      </button>
      <button v-if="canAbort" class="orange" @click="abort">
        Abort
      </button>
      <pre lang="yaml">{{ text }}</pre>
    </template>
  </div>
</template>
