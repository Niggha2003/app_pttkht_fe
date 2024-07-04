<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import importImage from '@/helpers/importImage'

import HP_HeaderNavbarComponent from './header/HP_HeaderNavbarComponent.vue'

const props = defineProps(['activeIndex'])

const activeIndex = props.activeIndex
const banner = importImage('banner', 'banner.jpg')
const logo = importImage('banner', 'logo.png')

const header_infos = [
  {
    text: 'Hotline: 0976760298',
    type: 'span',
    icon: 'pi pi-phone'
  },
  {
    text: 'Gmail: nguyennghia241003@gmail.com',
    type: 'span',
    icon: 'pi pi-envelope'
  },
  {
    text: 'Liên hệ',
    type: 'link',
    icon: 'pi pi-address-book',
    to: {
      name: 'hp_form_view'
    }
  },
  {
    text: 'Bạn là nhân viên?',
    type: 'link',
    icon: 'pi pi-users',
    to: {
      name: 'home'
    }
  }
]

const navbar_items = ref([
  {
    label: 'Trang chủ',
    icon: 'pi pi-home',
    active: false,
    to: {
      name: 'home_page'
    }
  },
  {
    label: 'Giới thiệu về công ty',
    active: false,
    to: {
      name: 'hp_intro_view'
    }
  },
  {
    label: 'Xuất khẩu lao động',
    active: false,
    to: {
      name: 'hp_order_view'
    }
  },
  {
    label: 'Đăng ký form',
    active: false,
    to: {
      name: 'hp_form_view'
    }
  }
])
navbar_items.value[activeIndex].active = true
</script>

<template>
  <div class="Header">
    <div class="Header__info__cover container-fluid">
      <div class="Header__info container d-flex justify-content-end" style="font-size: 11px">
        <template v-for="header_info in header_infos" :key="header_info">
          <span
            v-if="header_info.type == 'span'"
            class="d-flex align-items-center"
            style="color: white; padding: 8px 10px; margin-right: 5px"
          >
            <span :class="header_info.icon" style="margin-right: 3px"></span>
            {{ header_info.text }}
          </span>

          <RouterLink
            :to="header_info.to"
            v-if="header_info.type == 'link'"
            style="color: white; padding: 8px 10px; margin-right: 5px"
          >
            <span :class="header_info.icon" style="margin-right: 3px"></span>
            {{ header_info.text }}
          </RouterLink>
        </template>
      </div>
    </div>
    <div class="Header__banner" style="width: 100%">
      <div
        class="bg-image"
        :style="{
          width: '100%',
          height: '400px',
          'background-size': 'cover',
          'background-repeat': 'no-repeat',
          'background-position': 'top',
          'background-image': `url(${banner})`
        }"
      ></div>
    </div>
    <div class="Header__navbar" style="background-color: #ff7575">
      <HP_HeaderNavbarComponent
        v-model="navbar_items"
        style="transform: translateY(-50%)"
        :isRouter="true"
      >
        <template #start>
          <div
            class="bg-image me-3"
            :style="{
              width: '150px',
              height: '100%',
              padding: '0 10px',
              'background-size': 'contain',
              'background-repeat': 'no-repeat',
              'background-position': 'center',
              'background-image': `url(${logo})`
            }"
          ></div>
        </template>
      </HP_HeaderNavbarComponent>
    </div>
  </div>
</template>

<style scoped>
.Header__info__cover {
  background-color: #43454e;
}
</style>
