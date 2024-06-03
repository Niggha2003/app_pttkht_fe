<script setup>
import SidebarComponent from '@/components/SidebarComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
</script>

<template>
  <div class="d-flex">
    <div class="sidebarContainer">
      <sidebar-component></sidebar-component>
    </div>
    <div class="flex-grow-1 mt-5 ps-2" style="max-width: 1257px">
      <header-component></header-component>
      <div class="me-1">
        <slot></slot>
      </div>
      <footer-component></footer-component>
    </div>
  </div>
</template>

<style>
.sidebarContainer {
  width: 255px;
}
@media (max-width: 991.98px) {
  .sidebarContainer {
    width: 0;
  }
}
</style>
