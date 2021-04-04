<script setup lang="ts">
import Key from './Key.vue'
import { useMagicKeys } from '.'

const { shift, v, u, e, s, v_u_e, u_s_e } = useMagicKeys()
</script>

<template>
  <div class="flex">
    <img
      src="/vue.svg"
      class="h-20 m-auto transform transistion duration-500"
      :class="{'opacity-0': !v_u_e, 'rotate-180': shift }"
    />

    <div>
      <note class="text-center mt-0 mb-5">
        Press the following keys to test out
      </note>
      <div class="flex gap-3 justify-center">
        <Key :value="v">
          V
        </Key>
        <Key :value="u">
          u
        </Key>
        <Key :value="e">
          e
        </Key>
        <div class="mx-1"></div>
        <Key :value="u">
          U
        </Key>
        <Key :value="s">
          s
        </Key>
        <Key :value="e">
          e
        </Key>
      </div>

      <div class="flex gap-3 justify-center mt-3">
        <Key :value="shift">
          Shift
        </Key>
        <Key :value="v_u_e">
          Vue
        </Key>
        <Key :value="u_s_e">
          Use
        </Key>
      </div>
    </div>

    <img
      src="/favicon.svg"
      class="h-20 m-auto transform transistion duration-500"
      :class="{'opacity-0': !u_s_e, 'rotate-180': shift }"
    />
  </div>
</template>
