<script setup lang="ts">
import { data as sponsors } from '../sponsors.data'
import HomeSection from './HomeSection.vue'

const sizeClasses: Record<string, string> = {
  big: 'w-20 h-20',
  medium: 'w-16 h-16',
  small: 'w-12 h-12',
  mini: 'w-10 h-10',
  xmini: 'w-8 h-8',
}

const gapClasses: Record<string, string> = {
  big: 'gap-4',
  medium: 'gap-3',
  small: 'gap-2.5',
  mini: 'gap-2',
  xmini: 'gap-2',
}
</script>

<template>
  <HomeSection
    title="Anthony's Sponsors"
    description="The development of VueUse is supported by the following sponsors."
  />
  <div id="sponsor" w-full max-w-screen-md mx-auto mt-5>
    <div v-for="tier in sponsors" :key="tier.tier" mb-10>
      <h3 op50 text-sm font-normal text-center mt-6 mb-5>
        {{ tier.tier }}
      </h3>
      <div v-if="tier.tier === 'Special Sponsor'" flex justify-center>
        <a
          v-for="item in tier.items"
          :key="item.url"
          :href="item.url"
          target="_blank"
          rel="noopener"
          :title="item.name"
        >
          <img
            src="/vercel.svg"
            :alt="item.name"
            h-20
            op90
            hover:op100
            transition-opacity
          >
        </a>
      </div>
      <div v-else flex flex-wrap justify-center items-center :class="gapClasses[tier.size]">
        <a
          v-for="item in tier.items"
          :key="item.url"
          :href="item.url"
          target="_blank"
          rel="noopener"
          :title="item.name"
        >
          <img
            :src="item.img"
            :alt="item.name"
            :class="sizeClasses[tier.size]"
            rounded-full
            op80
            hover:op100
            transition-opacity
          >
        </a>
      </div>
    </div>
    <div mt-4 text-center>
      <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.part2.svg" target="_blank" rel="noopener noreferrer">
        <img
          crossorigin="anonymous"
          inline-block
          class="m-auto"
          loading="lazy"
          src="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.part2.svg"
          alt="Anthony Fu's backers"
        >
      </a>
    </div>
    <div mt-2 text-center>
      <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.past.svg" target="_blank" rel="noopener noreferrer">
        <img
          crossorigin="anonymous"
          inline-block
          class="m-auto"
          loading="lazy"
          src="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.past.svg"
          alt="Anthony Fu's past sponsors"
        >
      </a>
    </div>
  </div>
</template>
