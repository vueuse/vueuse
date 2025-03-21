<script setup lang="ts">
import type { CommitInfo } from '@vueuse/metadata'
import { functions } from '@vueuse/metadata'
import { computed } from 'vue'
import ChangelogEntry from './ChangelogEntry.vue'
// @ts-expect-error virtual
import changelog from '/virtual-changelog'

const props = defineProps<{ fn: string }>()
const info = computed(() => functions.find(i => i.name === props.fn))

const allCommits = changelog as CommitInfo[]

const names = computed(() => [props.fn, ...info.value?.alias || []])
const commits = computed(() => {
  const related = allCommits
    .filter(c => c.version || c.functions?.some(i => names.value.includes(i)))
  return related.filter((i, idx) => {
    if (i.version && (!related[idx + 1] || related[idx + 1]?.version))
      return false
    return true
  })
})
</script>

<template>
  <em v-if="!commits.length" opacity="70">No recent changes</em>

  <div class="grid grid-cols-[30px_auto] -ml-1 gap-1.5 children:my-auto">
    <ChangelogEntry v-for="(commit, idx) of commits" :key="commit.hash" :pending="idx === 0" :commit="commit" :function-name="fn" />
  </div>
</template>
