<script setup lang='ts'>
import { computed, ref, watch } from 'vue'
import type { UseFuseOptions } from '.'
import { useFuse } from '.'

interface DataItem {
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

const search = ref('')
const filterBy = ref('both')
const keys = computed(() => {
  if (filterBy.value === 'first')
    return ['firstName']
  else if (filterBy.value === 'last')
    return ['lastName']
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
const matchAllWhenSearchEmpty = ref(true)

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
  <div>
    <input v-model="search" placeholder="Search for someone..." type="text" w-full>
    <div flex flex-wrap>
      <div bg="dark:(dark-300) light-700" mr-2 border="1 light-900 dark:(dark-700)" rounded relative flex items-center>
        <i i-carbon-filter absolute left-2 opacity-70 />
        <select v-model="filterBy" px-8 bg-transparent>
          <option bg="dark:(dark-300) light-700" value="both">
            Full Name
          </option>
          <option bg="dark:(dark-300) light-700" value="first">
            First Name
          </option>
          <option bg="dark:(dark-300) light-700" value="last">
            Last Name
          </option>
        </select>
        <i i-carbon-chevron-down absolute right-2 pointer-events-none opacity-70 />
      </div>
      <span flex-1 />
      <div flex flex-row flex-wrap gap-x-4>
        <label class="checkbox">
          <input v-model="exactMatch" type="checkbox">
          <span>Exact Match</span>
        </label>
        <label class="checkbox">
          <input v-model="isCaseSensitive" type="checkbox">
          <span>Case Sensistive</span>
        </label>
        <label class="checkbox">
          <input v-model="matchAllWhenSearchEmpty" type="checkbox">
          <span>Match all when empty</span>
        </label>
      </div>
    </div>
  </div>
  <div mt-4>
    <template v-if="results.length > 0">
      <div v-for="result in results" :key="result.item.firstName + result.item.lastName" py-2>
        <div flex flex-col>
          <span>
            {{ result.item.firstName }} {{ result.item.lastName }}
          </span>
          <span text-sm opacity-50>
            Score Index: {{ result.refIndex }}
          </span>
        </div>
      </div>
    </template>
    <template v-else>
      <div text-center pt-8 pb-4 opacity-80>
        No Results Found
      </div>
    </template>
  </div>
</template>

<style scoped lang="postcss">
input {
  --tw-ring-offset-width: 1px !important;
  --tw-ring-color: #8885 !important;
  --tw-ring-offset-color: transparent !important;
}

.checkbox {
  @apply inline-flex items-center my-auto cursor-pointer select-none;
}

.checkbox input {
  appearance: none;
  padding: 0;
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
  display: inline-block;
  vertical-align: middle;
  background-origin: border-box;
  user-select: none;
  flex-shrink: 0;
  height: 1rem;
  width: 1rem;
  @apply bg-gray-400/30;
  @apply rounded-md h-4 w-4 select-none;
}

.checkbox input:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
}

.checkbox span {
  @apply ml-1.5 text-13px opacity-70;
}
</style>
