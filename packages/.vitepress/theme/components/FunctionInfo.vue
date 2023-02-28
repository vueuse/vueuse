<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
import { computed } from 'vue'
import { functions } from '@vueuse/metadata'
import exportSizes from '../../../export-size.json'

const props = defineProps<{ fn: string }>()
const info = computed(() => functions.find(i => i.name === props.fn))
const lastUpdated = useTimeAgo(new Date(info.value?.lastUpdated || 0))
const link = computed(() => `/functions\#category=${encodeURIComponent(info.value!.category!)}`)

const exportSize = exportSizes[info.value!.name as keyof typeof exportSizes]
const getFunctionLink = (fn: string) => {
  const info = functions.find(i => i.name === fn)
  return info?.docs?.replace(/https?:\/\/vueuse\.org\//g, '/')
}
</script>

<template>
  <div class="grid grid-cols-[100px_auto] gap-2 text-sm mt-4 mb-8 items-start">
    <div opacity="50">
      Category
    </div>
    <div><a :href="link">{{ info.category }}</a></div>
    <div opacity="50">
      Export Size
    </div>
    <div> {{ exportSize }}</div>
    <template v-if="info.package !== 'core' && info.package !== 'shared'">
      <div opacity="50">
        Package
      </div>
      <div><code>@vueuse/{{ info.package }}</code></div>
    </template>
    <template v-if="info.lastUpdated">
      <div opacity="50">
        Last Changed
      </div>
      <div>{{ lastUpdated }}</div>
    </template>
    <template v-if="info.alias?.length">
      <div opacity="50">
        Alias
      </div>
      <div flex="~ gap-1 wrap">
        <code v-for="(a, idx) of info.alias" :key="idx" class="!py-0">{{ a }}</code>
      </div>
    </template>
    <template v-if="info.related?.length">
      <div opacity="50">
        Related
      </div>
      <div flex="~ gap-1 wrap">
        <a
          v-for="(name, idx) of info.related"
          :key="idx"
          class="!py-0"
          :href="getFunctionLink(name)"
        >
          <code>{{ name }}</code>
        </a>
      </div>
    </template>
  </div>
</template>
