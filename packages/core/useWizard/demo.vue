<script setup lang="ts">
import { useWizard } from '@vueuse/core'
import { reactive } from 'vue'

const { index, current, next, steps, backTo, currentStepIs, isFirst, isLast, todo } = useWizard([
  'Billing address',
  'Terms',
  'Payment',
] as const)

const form = reactive({
  billingAddress: '',
  contract: false,
  carbonOffsetting: false,
  payment: 'credit-card' as 'paypal' | 'credit-card',
})

const wizard = reactive({
  index,
  current,
  steps,
  isFirst,
  isLast,
})

function canGoNext() {
  if (currentStepIs('Billing address') && form.billingAddress === '')
    return false

  if (currentStepIs('Terms') && !form.contract)
    return false

  return true
}

function submit() {
  if (!canGoNext())
    return

  next()
}
</script>

<template>
  <div>
    <div class="flex gap-2 justify-center">
      <div v-for="step in steps" :key="step" class="">
        <button :disabled="todo(step)" @click="backTo(step)" v-text="step" />
      </div>
    </div>

    <form class="mt-10" @submit.prevent="submit">
      <span class="text-lg font-bold" v-text="current" />
      <div class="flex gap-4 items-center">
        <div v-if="currentStepIs('Billing address')">
          <input v-model="form.billingAddress" type="text">
        </div>

        <div v-if="currentStepIs('Terms')">
          <div>
            <input id="carbon-offsetting" v-model="form.carbonOffsetting" type="checkbox" class="mr-2">
            <label for="carbon-offsetting">I accept to deposit a carbon offsetting fee</label>
          </div>
          <div>
            <input id="contract" v-model="form.contract" type="checkbox" class="mr-2">
            <label for="contract">I accept the terms of the contract</label>
          </div>
        </div>

        <div v-if="currentStepIs('Payment')">
          <div>
            <input id="credit-card" v-model="form.payment" type="radio" class="mr-2" value="credit-card">
            <label for="credit-card">Credit card</label>
          </div>
          <div>
            <input id="paypal" v-model="form.payment" type="radio" class="mr-2" value="paypal">
            <label for="paypal">PayPal</label>
          </div>
        </div>

        <button v-if="!isLast" :disabled="!canGoNext()">
          Next
        </button>

        <button v-if="isLast" :disabled="!canGoNext()">
          Submit
        </button>
      </div>
    </form>

    <div class="flex gap-4 mt-12">
      <div class="px-4 py-2 rounded border border-main space-y-2">
        <span class="font-bold">Form</span>
        <pre v-text="form" />
      </div>

      <div class="px-4 py-2 rounded border border-main space-y-2">
        <span class="font-bold">Wizard</span>
        <pre v-text="wizard" />
      </div>
    </div>
  </div>
</template>
