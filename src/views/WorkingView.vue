<script setup>
import InterfaceComponent from '@/components/InterfaceComponent.vue'
import { shallowRef } from 'vue'

const props = defineProps(['innerComponent'])

const componentRender = shallowRef(props.innerComponent)
</script>

<template>
  <InterfaceComponent>
    <keep-alive>
      <component :is="componentRender"></component>
    </keep-alive>
  </InterfaceComponent>
</template>
