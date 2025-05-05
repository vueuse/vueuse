<script setup lang="ts">
import {useRouteParams} from '../../../packages/router/useRouteParams'
import {useRouteQuery} from '../../../packages/router/useRouteQuery'
import {useRoute} from 'vue-router'

// const userName=useRouteQuery('userName','Mike')
// userName.value='Mike'
const userId=useRouteParams('userId',123)
userId.value=1
userId.value=999
const route=useRoute()
const handleClick=()=>{
console.log(userId.value);
console.log(route.fullPath);
console.log(route.path);
console.log(route.params);

// console.log(userName.value);
// console.log(route.fullPath);
// console.log(route.path);
// console.log(route.params);
// console.log(route.query);
}
</script>

<template>
<button @click="handleClick">点击</button>
</template>
