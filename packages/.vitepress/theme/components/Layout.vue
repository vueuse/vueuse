<script setup lang="ts">
import { inBrowser, useData, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { watch } from 'vue'
import { functions } from '../../../../packages/metadata/metadata'

const data = useData()
const router = useRouter()

// support client-side redirect for old functions paths
watch(
  () => data.page.value.isNotFound,
  (isNotFound) => {
    if (!isNotFound || !inBrowser) {
      return
    }

    const fn = functions.find(({ name }) => router.route.path.split('/')[1].startsWith(name))
    if (!fn) {
      return
    }

    const path = `/${fn.package}/${fn.name}/`
    history.replaceState(null, '', path)
    router.go(path)
  },
  { immediate: true },
)
</script>

<template>
  <DefaultTheme.Layout />
</template>
