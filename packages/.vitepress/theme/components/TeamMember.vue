<script setup lang="ts">
import type { TeamMember } from '../../../contributors'

defineProps<{
  data: TeamMember
}>()
</script>

<template>
  <div text-center h-full relative flex="~ col">
    <img
      loading="lazy"
      m-auto rounded-full min-w-25 min-h-25 h-30 w-30 mb--15
      shadow
      :src="data.avatar"
      :alt="`${data.name}'s avatar`"
    >
    <div bg-gray:5 rounded-xl pt-18 p4 flex="~ col gap-2 items-center" flex-auto>
      <div text-xl>
        {{ data.name }}
      </div>
      <div op60 v-html="data.description" />

      <div flex="~ inline gap-2" py4 text-2xl>
        <a
          class="i-carbon-logo-github inline-block color-inherit! op75 hover:op100 hover:text-primary! mya transition duration-200"
          :href="`https://github.com/${data.github}`"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`${data.name} on GitHub`"
        />
        <a
          v-if="data.bluesky"
          class="i-ri-bluesky-fill inline-block mya color-inherit! op75 hover:op100 hover:text-primary! transition duration-200"
          :href="`https://bsky.app/profile/${data.bluesky}`"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`${data.name} on Bluesky`"
        />
        <a
          v-if="data.twitter"
          class="i-carbon-logo-x inline-block mya color-inherit! op75 hover:op100 hover:text-primary! transition duration-200"
          :href="`https://x.com/${data.twitter}`"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`${data.name} on X`"
        />
        <a
          v-if="data.sponsors"
          class="i-carbon-favorite-filled inline-block mya color-inherit! op75 hover:op100 hover:text-rose! transition duration-200"
          :href="`https://github.com/sponsors/${data.github}`"
          target="_blank"
          rel="noopener noreferrer"
          :title="`Sponsor ${data.name}`"
          :aria-label="`Sponsor ${data.name}`"
        />
      </div>
    </div>
  </div>
</template>
