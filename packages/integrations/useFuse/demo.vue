<script setup lang='ts'>
import { ref, computed, watch } from 'vue'
import { useFuse, UseFuseOptions } from '.'

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
  data.value.sort(() => Math.random() - 0.5)
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

const options = computed<UseFuseOptions<DataItem>>(() => ({
  fuseOptions: {
    keys: keys.value,
    isCaseSensitive: isCaseSensitive.value,
    threshold: exactMatch.value ? 0 : undefined,
  },
  resultLimit: resultLimit.value,
  matchAllWhenSearchEmpty: matchAllWhenSearchEmpty.value,
}))

const { results } = useFuse(search, data, options)
</script>

<template>
  <div class="flex flex-wrap gap-8">
    <section class="flex-1 flex flex-col items-start min-w-xs max-h-xl space-y-4">
      <h2 class="mt-0 self-stretch">
        Search
      </h2>
      <input v-model="search" type="text" placeholder="Search for someone" />
      <fieldset class="max-w-max border-2 rounded-lg border-gray-400/30">
        <legend class="px-1">
          Search by
        </legend>
        <div>
          <input id="radio-both" v-model="filterBy" type="radio" value="both" name="filter" />
          <label for="radio-both">Both Names</label>
        </div>
        <div>
          <input id="radio-first" v-model="filterBy" type="radio" value="first" name="filter" />
          <label for="radio-first">First Name</label>
        </div>
        <div>
          <input id="radio-last" v-model="filterBy" type="radio" value="last" name="filter" />
          <label for="radio-last">Last Name</label>
        </div>
      </fieldset>
      <fieldset class="max-w-max border-2 rounded-lg border-gray-400/30 space-y-1">
        <legend class="px-1">
          Other Options
        </legend>
        <div>
          <input id="checkbox-exact-match" v-model="exactMatch" type="checkbox" />
          <label for="checkbox-exact-match">Exact match</label>
        </div>
        <div>
          <input id="checkbox-case-sensitive" v-model="isCaseSensitive" type="checkbox" />
          <label for="checkbox-case-sensitive">Case sensistive</label>
        </div>
        <div>
          <input id="checkbox-match-all" v-model="matchAllWhenSearchEmpty" type="checkbox" />
          <label for="checkbox-match-all">Match all when search is blank</label>
        </div>
      </fieldset>
      <fieldset class="max-w-max border-2 rounded-lg border-gray-400/30">
        <legend>Result count limit</legend>
        <note>Limit the number of results shown.</note>
        <input id="input-result-limit" v-model="resultLimitString" type="number" />
      </fieldset>
    </section>
    <section class="flex-1 flex flex-col min-w-xs max-h-xl">
      <h2 class="mt-0">
        Results
      </h2>
      <note>Result Count: {{ results.length }}</note>
      <ol v-if="results.length > 0" class="mt-6 overflow-y-scroll space-y-2" start="0">
        <li v-for="(result, index) in results" :key="index" class="mr-2 px-2 py-1 rounded-lg bg-gray-400/20">
          <span>{{ result.item.firstName }} {{ result.item.lastName }}</span>
          <br />
          <span>Source Index: {{ result.refIndex }}</span>
        </li>
      </ol>
      <div v-else class="mt-4 text-2xl">
        No results
      </div>
    </section>
    <section class="flex-1 flex flex-col min-w-xs max-h-xl">
      <h2 class="mt-0 mb-3">
        Source Data
      </h2>
      <button class="self-center" @click="shuffleData">
        Shuffle Data
      </button>
      <ol class="overflow-y-scroll space-y-2" start="0">
        <li v-for="(item, index) in data" :key="index" class="mr-2 px-2 py-1 rounded-lg bg-gray-400/20">
          First name: {{ item.firstName }}
          <br />
          Last name: {{ item.lastName }}
        </li>
      </ol>
    </section>
  </div>
</template>
