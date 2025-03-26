<script setup lang="ts">
import type { TeamMember } from '../../../contributors'

defineProps<{
  members: TeamMember[]
}>()
</script>

<template>
  <div grid="~ sm:cols-1 md:cols-2 lg:cols-3 gap-x-3 gap-y-20 items-start" p-10>
    <TeamMember
      v-for="c of members"
      :key="c.github"
      :data="c"
    />
  </div>
</template>
