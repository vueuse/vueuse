<script setup lang="ts">
import { emeriti, team } from '../../../contributors'
import HomeSection from './HomeSection.vue'
import TeamMembersGrid from './TeamMembersGrid.vue'
</script>

<template>
  <div class="vp-doc">
    <HomeSection
      title="Team Members"
      description="The development of VueUse is guided by an international team, some of whom have chosen to be featured below."
    />
    <TeamMembersGrid
      :members="team"
    />
    <HomeSection
      title="Team Emeriti"
      description="Here we honor some no-longer-active team members who have made valuable contributions in the past."
    />
    <TeamMembersGrid
      :members="emeriti"
    />
  </div>
</template>
