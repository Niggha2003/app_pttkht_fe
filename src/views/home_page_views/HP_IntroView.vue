<script setup>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { get, post } from '@/utils/httpRequest'

import ScrollTop from 'primevue/scrolltop'

import HP_HeaderComponent from '@/components/home_page_components/HP_HeaderComponent.vue'
import HP_FooterComponent from '@/components/home_page_components/HP_FooterComponent.vue'
import HP_ModifyComponent from '@/components/home_page_components/modify/HP_ModifyComponent.vue'
import HP_IntroduceContentComponent from '@/components/home_page_components/introduce/HP_IntroduceContentComponent.vue'

const store = useStore()
const introduce = ref(null)
const newses = ref(null)
const isHomePageModify = ref(store.state.isHomePageModify)

onMounted(async () => {
  await getIntroduce()
  await getNews()
})

const getIntroduce = async () => {
  introduce.value = await get('/introduce')
}

const setIntroduce = async () => {
  introduce.value.time = new Date()
  let result
  result = await post('/introduce', { introduce: introduce.value })
  await getIntroduce()
  return result
}

const getNews = async () => {
  newses.value = await get('/news')
  newses.value = newses.value.reverse().splice(0, 6)
}
</script>

<template>
  <HP_ModifyComponent
    v-model:state="isHomePageModify"
    :saveFunction="setIntroduce"
  ></HP_ModifyComponent>
  <HP_HeaderComponent :activeIndex="1"></HP_HeaderComponent>
  <HP_IntroduceContentComponent
    v-model:newses="newses"
    v-model:isHomePageModify="isHomePageModify"
    v-model:introduce="introduce"
  ></HP_IntroduceContentComponent>
  <HP_FooterComponent></HP_FooterComponent>
  <ScrollTop
    :pt="{
      root: {
        style: 'background-color: #5bb7dc',
        class: 'rounded'
      }
    }"
  />
</template>

<style></style>
