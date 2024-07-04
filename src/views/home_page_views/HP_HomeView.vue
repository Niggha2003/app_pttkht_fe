<script setup>
import HP_HeaderComponent from '@/components/home_page_components/HP_HeaderComponent.vue'
import HP_FooterComponent from '@/components/home_page_components/HP_FooterComponent.vue'
import HP_HomeViewSliderComponent from '@/components/home_page_components/home_view/HP_HomeViewSliderComponent.vue'
import HP_HomeViewNewsComponent from '@/components/home_page_components/home_view/HP_HomeViewNewsComponent.vue'
import HP_HomeViewOrderComponent from '@/components/home_page_components/home_view/HP_HomeViewOrderComponent.vue'
import HP_HomeViewPartnerOrganizationComponent from '@/components/home_page_components/home_view/HP_HomeViewPartnerOrganizationComponent.vue'

import ScrollTop from 'primevue/scrolltop'
</script>

<template>
  <HP_HeaderComponent :activeIndex="0"></HP_HeaderComponent>
  <HP_HomeViewNewsComponent></HP_HomeViewNewsComponent>
  <HP_HomeViewSliderComponent style="margin-bottom: 70px"></HP_HomeViewSliderComponent>
  <HP_HomeViewOrderComponent style="margin-bottom: 70px"></HP_HomeViewOrderComponent>
  <HP_HomeViewPartnerOrganizationComponent
    style="margin-bottom: 70px"
  ></HP_HomeViewPartnerOrganizationComponent>
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
