<script setup lang="ts">
import { useOutputByChar } from './index'

const { showText, pending, start, stop, clear, done } = useOutputByChar(0)

const text = `A man walks into a pet store and sees a parrot with a sign on its cage that says, “Talking Parrot: $50.”

Intrigued, he asks the store owner, “Why is the parrot so cheap? Does it not talk?”

“Oh, it talks,” says the owner, “but there’s a catch. You see, this parrot spent years in a seedy bar, so its language is… let’s say… colorful.”

The man thinks for a second and figures, “I can teach it to behave. It’s just a bird.” So, he buys the parrot and takes it home.

As soon as the man walks through the door, the parrot looks around and squawks, “New joint, huh? Looks like a dump!” The man frowns but decides to give it time.

A few hours later, the man’s daughters come home from school. The parrot screeches, “Hey! Fresh meat!” The man is horrified, but still determined to make this work.

The next morning, the man’s wife walks into the room, and the parrot says, “Well, well, well… who’s this lovely lady? You deserve better than this loser!”

At this point, the man has had enough. He grabs the parrot and shoves it into the freezer. “Maybe a little cold time will teach you some manners!” he says, slamming the door shut.

For the first few minutes, the parrot squawks and bangs around inside. Then, suddenly, it goes completely quiet.

After a couple of minutes of silence, the man starts to feel bad. “Oh no, I might have killed it,” he thinks. He quickly opens the freezer door.

The parrot calmly steps out, shivering a bit. “I apologize for my rude behavior, sir,” the parrot says politely. “I have reflected on my actions and will no longer say anything offensive.”

The man is shocked but impressed. “Well, I’m glad to hear that,” he says.

The parrot glances nervously at the freezer and adds, “By the way, what exactly did the chicken do?”`

let timer: number | undefined
let startIndex = 0

function handleStart(reSatrt: boolean) {
  if (reSatrt) {
    startIndex = 0
    handleClear()
  }

  // mock sse
  timer = setInterval(() => {
    let endIndex = startIndex + Number.parseInt(`${Math.random() * 10}`)
    if (endIndex > text.length) {
      endIndex = text.length
    }

    // add text
    start(text.slice(startIndex, endIndex))
    startIndex = endIndex

    // done
    if (showText.value.length === text.length) {
      clearInterval(timer)
      done()
    }
  }, 200) as unknown as number
}

function handleStop() {
  clearInterval(timer)
  stop()
}

function handleContinue() {
  handleStart(false)
}

function handleClear() {
  startIndex = 0
  clearInterval(timer)
  clear()
}
</script>

<template>
  <div>
    <p class="ouput-content" :class="{ pending }">
      {{ showText }}
    </p>
    <button @click="handleStart(true)">
      start
    </button>
    <button v-if="pending" @click="handleStop">
      stop
    </button>
    <button v-else @click="handleContinue">
      continue
    </button>
    <button @click="handleClear">
      clear
    </button>
  </div>
</template>

<style>
.ouput-content.pending:after {
  content: '';
  display: inline-block;
  width: 1em;
  height: 4px;
  vertical-align: text-bottom;
  background-color: var(--vp-c-brand-1);
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  50% {
    background-color: transparent;
  }
}
</style>
