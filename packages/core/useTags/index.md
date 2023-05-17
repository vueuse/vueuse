# useTags

Simple functionality to toggle between multiple variables (for example for filtration purposes).
Works with strings and objects, if you pass object you can pass comparable property to check (for enabling multiple tags at once if needed)

## Usage

```vue
<script setup lang="ts">
import { useTags } from '.'

interface IObjectTag {
  name: string
  rating: number
}

// String tags
const fruits: string[] = ['Banana', 'Apple', 'Kiwi', 'Orange', 'Pomegranates']

// Object tags
const people: IObjectTag[] = [
  { name: 'Elon', rating: -1 },
  { name: 'Kyle', rating: -1 },
  { name: 'Anthony', rating: 999 },
  { name: 'Evan', rating: 10000 },
]

// Use property renaming to use multiple instances
const {
  tags: fruitTags,
  toggleTag: toggleFruitTag,
  isTagInTags: isFruitTagToggled,
  clearTags: clearFruits,
  isClear: isFruitTagsClear,
} = useTags()

// With initial values and access property
const {
  tags: peopleTags,
  toggleTag: togglePeopleTag,
  isTagInTags: isPeopleTagEnabled,
  clearTags: clearPeople,
  isClear: isPeopleTagsClear,
} = useTags<IObjectTag>(people, 'rating')
</script>

<template>
  <div class="container">
    <ul>
      <li>
        <!-- A button for toggling all tags. If there is no tags, it is active. On click clears everything and becomes inactive -->
        <button :class="isFruitTagsClear && 'toggled'" @click="clearFruits">
          All fruits
        </button>
      </li>
      <li v-for="tag in fruits" :key="tag">
        <!-- Loop through an array of tags to render several buttons. Each button is toggling its tag on click and is being watched on the tag being active -->
        <button :class="isFruitTagToggled(tag) && 'toggled'" @click="toggleFruitTag(tag)">
          {{ tag }}
        </button>
      </li>
    </ul>

    <ul>
      <li>
        <!-- Same thing with objects -->
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
```
