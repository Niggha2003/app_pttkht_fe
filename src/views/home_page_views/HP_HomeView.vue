<script setup>
import { useStore } from 'vuex'
import { ref } from 'vue'

import HP_HeaderComponent from '@/components/home_page_components/HP_HeaderComponent.vue'
import HP_FooterComponent from '@/components/home_page_components/HP_FooterComponent.vue'
import HP_HomeViewSliderComponent from '@/components/home_page_components/home_view/HP_HomeViewSliderComponent.vue'
import HP_HomeViewNewsComponent from '@/components/home_page_components/home_view/HP_HomeViewNewsComponent.vue'
import HP_HomeViewOrderComponent from '@/components/home_page_components/home_view/HP_HomeViewOrderComponent.vue'
import HP_HomeViewPartnerOrganizationComponent from '@/components/home_page_components/home_view/HP_HomeViewPartnerOrganizationComponent.vue'
import HP_ModifyComponent from '@/components/home_page_components/modify/HP_ModifyComponent.vue'

import ScrollTop from 'primevue/scrolltop'

const store = useStore()

const isHomePageModify = ref(store.state.isHomePageModify)
const updateNewsFunction = ref(async () => {})
const updateSlideFunction = ref(async () => {})
const updateOrderFunction = ref(async () => {})

const updateFunction = async () => {
  const results = await Promise.all([
    updateNewsFunction.value(),
    updateSlideFunction.value(),
    updateOrderFunction.value()
  ])
  let result
  for (let res of results) {
    result = res
    if (!res.status) {
      break
    }
  }
  return result
}
</script>

<template>
  <HP_ModifyComponent
    v-model:state="isHomePageModify"
    :saveFunction="updateFunction"
  ></HP_ModifyComponent>
  <HP_HeaderComponent :activeIndex="0"></HP_HeaderComponent>
  <HP_HomeViewNewsComponent
    v-model:isHomePageModify="isHomePageModify"
    v-model:updateFunction="updateNewsFunction"
  ></HP_HomeViewNewsComponent>
  <HP_HomeViewSliderComponent
    v-model:isHomePageModify="isHomePageModify"
    v-model:updateFunction="updateSlideFunction"
    style="margin-bottom: 70px"
  ></HP_HomeViewSliderComponent>
  <HP_HomeViewOrderComponent
    v-model:isHomePageModify="isHomePageModify"
    v-model:updateFunction="updateOrderFunction"
    style="margin-bottom: 70px"
  ></HP_HomeViewOrderComponent>
  <HP_HomeViewPartnerOrganizationComponent
    v-model:isHomePageModify="isHomePageModify"
    style="margin-bottom: 70px"
  ></HP_HomeViewPartnerOrganizationComponent>
  <HP_FooterComponent v-model:isHomePageModify="isHomePageModify"></HP_FooterComponent>
  <ScrollTop
    :pt="{
      root: {
        style: 'background-color: #5bb7dc',
        class: 'rounded'
      }
    }"
  />
</template>
