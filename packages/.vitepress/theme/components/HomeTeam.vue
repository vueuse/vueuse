<script setup lang="ts">
import { contributors, coreTeamMembers } from '../../../contributors'
</script>
<template>
  <h2 op50 font-normal pt-5 pb-2>
    Meet The Team
  </h2>
  <div grid="~ sm:cols-3 gap-x-8 gap-y-20 items-center" p-10>
    <Avatar
      v-for="c of coreTeamMembers"
      :key="c.github"
      v-bind="c"
    />
  </div>
</template>

<script setup lang="ts">

</script>
