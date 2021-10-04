<script setup lang='ts'>
import { ref, computed, watch } from 'vue'
import { useFuse, UseFuseOptions, FuseOptions } from '.'

type DataItem = {
  firstName: string
  lastName: string
}

const data = ref<DataItem[]>([
  {
    firstName: 'Roslyn',
    lastName: 'Mitchell',
  },
  {
    firstName: 'Cathleen',
    lastName: 'Matthews',
  },
  {
    firstName: 'Carleton',
    lastName: 'Harrelson',
  },
  {
    firstName: 'Allen',
    lastName: 'Moores',
  },
  {
    firstName: 'John',
    lastName: 'Washington',
  },
  {
    firstName: 'Brooke',
    lastName: 'Colton',
  },
  {
    firstName: 'Mary',
    lastName: 'Rennold',
  },
  {
    firstName: 'Nanny',
    lastName: 'Field',
  },
  {
    firstName: 'Chasity',
    lastName: 'Michael',
  },
  {
    firstName: 'Oakley',
    lastName: 'Giles',
  },
  {
    firstName: 'Johanna',
    lastName: 'Shepherd',
  },
  {
    firstName: 'Maybelle',
    lastName: 'Wilkie',
  },
  {
    firstName: 'Dawson',
    lastName: 'Rowntree',
  },
  {
    firstName: 'Manley',
    lastName: 'Pond',
  },
  {
    firstName: 'Lula',
    lastName: 'Sawyer',
  },
  {
    firstName: 'Hudson',
    lastName: 'Hext',
  },
  {
    firstName: 'Alden',
    lastName: 'Senior',
  },
  {
    firstName: 'Tory',
    lastName: 'Hyland',
  },
  {
    firstName: 'Constance',
    lastName: 'Josephs',
  },
  {
    firstName: 'Larry',
    lastName: 'Kinsley',
  },
])
const shuffleData = () => {
  data.value.sort((a, b) => Math.random() - 0.5)
}

const search = ref('')

const filterBy = ref('both')
const keys = computed(() => {
  if (filterBy.value === 'first') return ['firstName']
  else if (filterBy.value === 'last') return ['lastName']
  else return ['firstName', 'lastName']
})

const resultLimit = ref<number | undefined>(undefined)
const resultLimitString = ref<string>('')
watch(resultLimitString, () => {
  if (resultLimitString.value === '') {
    resultLimit.value = undefined
  }
  else {
    const float = parseFloat(resultLimitString.value)
    if (!isNaN(float)) {
      resultLimit.value = Math.round(float)
      resultLimitString.value = resultLimit.value.toString()
    }
  }
})

const exactMatch = ref(false)
const isCaseSensitive = ref(false)
const matchAllWhenSearchEmpty = ref(false)

const fuseOptions = computed<FuseOptions<DataItem>>(() => ({
  keys: keys.value,
  isCaseSensitive: isCaseSensitive.value,
  threshold: exactMatch.value ? 0 : undefined,
}))

const options = computed<UseFuseOptions>(() => ({
  resultLimit: resultLimit.value,
  matchAllWhenSearchEmpty: matchAllWhenSearchEmpty.value,
}))

const { results } = useFuse(search, data, fuseOptions, options)
</script>

<template>
  <div id="grid">
    <section>
      <h2>Search</h2>
      <input v-model="search" type="text" />
      <div class="group">
        <p>Search by:</p>
        <div>
          <input id="radio-both" v-model="filterBy" type="radio" value="both" name="filter">
          <label for="radio-both">Both Names</label>
        </div>
        <div>
          <input id="radio-first" v-model="filterBy" type="radio" value="first" name="filter">
          <label for="radio-first">First Name</label>
        </div>
        <div>
          <input id="radio-last" v-model="filterBy" type="radio" value="last" name="filter">
          <label for="radio-last">Last Name</label>
        </div>
      </div>
      <div class="group">
        <input id="checkbox-exact-match" v-model="exactMatch" type="checkbox">
        <label for="checkbox-exact-match">Exact match</label>
      </div>
      <div class="group">
        <input id="checkbox-case-sensitive" v-model="isCaseSensitive" type="checkbox">
        <label for="checkbox-case-sensitive">Case sensistive</label>
      </div>
      <div class="group">
        <input id="checkbox-match-all" v-model="matchAllWhenSearchEmpty" type="checkbox">
        <label for="checkbox-match-all">Match all when search is blank</label>
      </div>
      <div class="group">
        <label for="input-result-limit">Result count limit</label>
        <note>Limit the number of results shown.</note>
        <input id="input-result-limit" v-model="resultLimitString" type="number">
      </div>
    </section>
    <section>
      <h2>Results</h2>
      <ol v-if="results.length > 0" class="list" start="0">
        <li v-for="(result, index) in results" :key="index" class="search-result">
          <span>{{ result.item.firstName }} {{ result.item.lastName }}</span>
          <br />
          <span>Source Index: {{ result.index }}</span>
        </li>
      </ol>
      <div v-else class="no-results-message">
        No results
      </div>
    </section>
    <section>
      <h2>Source Data</h2>
      <button @click="shuffleData">
        Shuffle Data
      </button>
      <ol class="list" start="0">
        <li v-for="(item, index) in data" :key="index" class="data-item">
          First name: {{ item.firstName }}
          <br>
          Last name: {{ item.lastName }}
        </li>
      </ol>
    </section>
  </div>
</template>

<style>
#grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
}

section {
  max-height: 500px;
  display: flex;
  flex-direction: column;
}

section button {
  align-self: center;
}

.group + .group {
  margin-top: 1rem;
}

.list {
  overflow-y: scroll;
}

.search-result, .data-item {
  margin: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: #f2f2f2;
}

.no-results-message {
  padding: 0.5rem;
  font-size: 1.5em;
}
</style>
