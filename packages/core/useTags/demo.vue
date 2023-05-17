<script setup lang="ts">
import { useTags } from '.'

interface IObjectTag {
  name: string
  rating: number
}

const fruits: string[] = ['Banana', 'Apple', 'Kiwi', 'Orange', 'Pomegranates']

const people: IObjectTag[] = [
  { name: 'Elon', rating: -1 },
  { name: 'Kyle', rating: -1 },
  { name: 'Anthony', rating: 999 },
  { name: 'Evan', rating: 10000 },
]

const { tags: fruitTags, toggleTag: toggleFruitTag, isTagInTags: isFruitTagToggled, clearTags: clearFruits, isClear: isFruitTagsClear } = useTags()

const { tags: peopleTags, toggleTag: togglePeopleTag, isTagInTags: isPeopleTagEnabled, clearTags: clearPeople, isClear: isPeopleTagsClear } = useTags<IObjectTag>(people, 'rating')
</script>

<template>
  <div class="container">
    <ul>
      <li>
        <button :class="isFruitTagsClear && 'toggled'" @click="clearFruits">
          All fruits
        </button>
      </li>
      <li v-for="tag in fruits" :key="tag">
        <button :class="isFruitTagToggled(tag) && 'toggled'" @click="toggleFruitTag(tag)">
          {{ tag }}
        </button>
      </li>
    </ul>

    <ul>
      <li>
        <button :class="isPeopleTagsClear && 'toggled'" @click="clearPeople">
          All fruits
        </button>
      </li>
      <li v-for="tag in people" :key="tag.name">
        <button :class="isPeopleTagEnabled(tag) && 'toggled'" @click="togglePeopleTag(tag)">
          {{ tag.name }}
        </button>
      </li>
    </ul>

    {{ JSON.stringify([peopleTags, fruitTags]) }}
  </div>
</template>

<style scoped>
button {
  border: none;
  background: none;
  cursor: pointer;
}

.container {
  width: 60rem;
  margin: 0 auto;
  max-width: 100vw;

  display: flex;
  gap: 2rem;
}

.container ul {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

li button {
  transition: 0.25s ease all;
  padding: .5rem;
}

.toggled {
  background-color: black;
  color: white;

}
</style>
