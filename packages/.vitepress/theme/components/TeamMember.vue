<script setup lang="ts">
import type { CoreTeam } from '../../../contributors'

defineProps<{
  data: CoreTeam
}>()
</script>

<template>
  <div text-center>
    <img
      loading="lazy"
      width="100" height="100" m-auto rounded-full min-w-25 min-h-25 h-25 w-25
      :src="data.avatar"
      :alt="`${data.name}'s avatar`"
    >
    <div text-xl mt-2 mb-1>
      {{ data.name }}
    </div>
    <div op60 h-80px v-html="data.description" />

    <div flex="~ inline gap-2" py2 text-2xl>
      <a
        class="i-carbon-logo-github inline-block text-current op30 hover:op100 mya transition duration-200"
        :href="`https://github.com/${data.github}`"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="`${data.name} on GitHub`"
      />
      <a
        v-if="data.twitter"
        class="i-carbon-logo-twitter inline-block text-1.3em mya text-current op30 hover:op100 transition duration-200"
        :href="`https://twitter.com/${data.twitter}`"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="`${data.name} on Twitter`"
      />
      <a
        v-if="data.sponsors"
        class="i-carbon-favorite-filled inline-block mya text-current op30 hover:op100 transition duration-200"
        :href="`https://github.com/sponsors/${data.github}`"
        target="_blank"
        rel="noopener noreferrer"
        :title="`Sponsor ${data.name}`"
        :aria-label="`Sponsor ${data.name}`"
      />
    </div>
    <div v-if="data.functions || data.packages" bg-gray:5 mb2 p3 rounded grid="~ cols-[20px_1fr] gap-x-1 gap-y-2" items-start w="5/6" mxa>
      <template v-if="data.functions">
        <div op50 ma i-carbon:function-math title="Functions" />
        <div flex="~ col gap-1" text-left text-sm w-max>
          <a v-for="f of data.functions" :key="f" :href="`/${f}`" target="_blank">
            <code>{{ f }}</code>
          </a>
        </div>
      </template>
      <template v-if="data.packages">
        <div op50 ma i-carbon-cube title="Packages" />
        <div flex="~ col gap-1" text-left text-sm w-max>
          <a v-for="f of data.packages" :key="f" href="/add-ons">
            <code>@vueuse/{{ f }}</code>
          </a>
        </div>
      </template>
    </div>
  </div>
</template>
