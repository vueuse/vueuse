<script setup lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { computed } from 'vue'
import { functions } from '../../../../packages/metadata/metadata'

dayjs.extend(relativeTime)

const props = defineProps<{ fn: string }>()

const info = computed(() => functions.find(i => i.name === props.fn))
const format = (ts: number) => dayjs(ts).fromNow()
const link = computed(() => `/functions\#category=${encodeURIComponent(info.value.category)}`)
</script>

<template>
  <div class="grid grid-cols-[100px_auto] gap-2 text-sm -mt-2 mb-8 items-center">
    <div opacity="50">
      Category
    </div>
    <div><a :href="link">{{ info.category }}</a></div>
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
      <div>{{ format(info.lastUpdated) }}</div>
    </template>
    <template v-if="info.alias?.length">
      <div opacity="50">
        Alias
      </div>
      <div flex="~ gap-1">
        <code v-for="a, idx of info.alias" :key="idx" class="!py-0">{{ a }}</code>
      </div>
    </template>
  </div>
</template>
