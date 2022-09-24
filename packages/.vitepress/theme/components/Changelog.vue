<script setup lang="ts">
// @ts-expect-error virtual
import changelog from '/virtual-changelog'
import { computed } from 'vue'
import type { CommitInfo } from '@vueuse/metadata'
import { renderCommitMessage } from '../utils'
import { functions } from '@vueuse/metadata'

const props = defineProps<{ fn: string }>()
const info = computed(() => functions.find(i => i.name === props.fn))

const allCommits = changelog as CommitInfo[]

const names = computed(() => [props.fn, ...info.value.alias || []])
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
    <template v-for="(commit, idx) of commits" :key="commit.hash">
      <template v-if="idx === 0 && !commit.version">
        <div m="t-1" />
        <div m="t-1" />
        <div class="m-auto inline-flex bg-gray-400/10 w-7 h-7 rounded-full text-sm opacity-90">
          <octicon-git-pull-request-draft-16 m="auto" />
        </div>
        <div>
          <code>Pending for release...</code>
        </div>
      </template>
      <template v-if="commit.version">
        <div m="t-1" />
        <div m="t-1" />
        <div class="m-auto inline-flex bg-gray-400/10 w-7 h-7 rounded-full text-sm opacity-90">
          <octicon-rocket-16 m="auto" />
        </div>
        <div>
          <a
            :href="`https://github.com/vueuse/vueuse/releases/tag/${commit.version}`"
            target="_blank"
          >
            <code class="!text-primary font-bold">{{ commit.version }}</code>
          </a>
          <span class="opacity-50 text-xs"> on {{ new Date(commit.date).toLocaleDateString() }}</span>
        </div>
      </template>
      <template v-else>
        <octicon-git-commit-16 class="m-auto transform rotate-90 opacity-30" />
        <div>
          <a :href="`https://github.com/vueuse/vueuse/commit/${commit.hash}`" target="_blank">
            <code class="!text-xs !text-$vp-c-text-2 !hover:text-primary">{{ commit.hash.slice(0, 5) }}</code>
          </a>
          <span text="sm">
            -
            <span v-html="renderCommitMessage(commit.message.replace(`(${fn})`, ''))" />
          </span>
        </div>
      </template>
    </template>
  </div>
</template>
