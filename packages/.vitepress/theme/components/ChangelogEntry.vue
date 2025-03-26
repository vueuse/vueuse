<script setup lang="ts">
import type { CommitInfo } from '@vueuse/metadata'
import type { PropType } from 'vue'
import { computed, onMounted, shallowRef } from 'vue'
import { renderCommitMessage } from '../utils'

const props = defineProps({
  commit: {
    type: Object as PropType<CommitInfo>,
    required: true,
  },
  pending: {
    type: Boolean,
    default: false,
  },
  functionName: {
    type: String,
    required: true,
  },
})

const datetime = shallowRef('')

const isoDateTime = computed(() => {
  return new Date(props.commit?.date).toISOString()
})

onMounted(() => {
  datetime.value = new Intl.DateTimeFormat().format(new Date(props.commit?.date))
})
</script>

<template>
  <template v-if="pending && !commit.version">
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
      <span class="opacity-50 text-xs"> on <time :datetime="isoDateTime">{{ datetime }}</time></span>
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
        <span v-html="renderCommitMessage(commit.message.replace(`(${functionName})`, ''))" />
      </span>
    </div>
  </template>
</template>
