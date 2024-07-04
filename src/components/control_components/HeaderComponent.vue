<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref } from 'vue'
import Cookies from 'js-cookie'
import { useStore } from 'vuex'

import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'

import { faBell } from '@fortawesome/free-regular-svg-icons'

import importImage from '@/helpers/importImage'

import OverlayPanel from 'primevue/overlaypanel'

const store = useStore()
const router = useRouter()

const user = store.state.user
const accountImg = importImage('user', user.photo)

const avatar = ref()
const notice = ref()

const notices = ref([])
const isReadNotice = ref(false)

/**
 * chỉnh sửa 1 chuỗi thời gian
 * @param {*} date
 * @returns
 */
function modifyDateValue(date) {
  date = date.replaceAll(/ /g, ', ')

  let n = date.lastIndexOf(', ')

  date = date.slice(0, n) + ' - ' + date.slice(n + 2)
  //
  return date
}

notices.value = [
  {
    title: 'Trang chủ',
    noticeContent: 'Bạn vừa đăng 1 bài viết',
    read: false,
    time: 'Fri Apr 26 2024 16:41:20 GMT+0700 (Giờ Đông Dương)'
  },
  {
    title: 'Trang chủ',
    noticeContent: 'Bạn vừa đăng 1 bài viết',
    read: false,
    time: 'Fri Apr 26 2024 16:41:20 GMT+0700 (Giờ Đông Dương)'
  },
  {
    title: 'Trang chủ',
    noticeContent: 'Bạn vừa đăng 1 bài viết',
    read: false,
    time: 'Fri Apr 26 2024 16:41:20 GMT+0700 (Giờ Đông Dương)'
  }
]

const toggleAvatar = (event) => {
  avatar.value.toggle(event)
}

const toggleNotice = (event) => {
  notice.value.toggle(event)
}

const handleSignOut = () => {
  store.commit('login', false)
  sessionStorage.removeItem('user')
  sessionStorage.removeItem('dataNeeded')
  Cookies.set('jwt-token', '', { expires: 0 })
  router.push('/control/login')
}
</script>

<template>
  <div class="header d-flex flex-row-reverse">
    <!-- Trang cá nhân -->
    <div
      class="rounded-circle me-3 bg-image"
      :style="{
        width: '35px',
        'min-height': '35px',
        'background-size': 'cover',
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'background-image': `url(${accountImg})`
      }"
      @click="toggleAvatar"
    ></div>
    <OverlayPanel ref="avatar">
      <div style="width: 100%" @click.stop>
        <router-link
          :to="{
            name: 'home'
          }"
          class="btn btn-outline-info border-0"
          style="text-decoration: none"
          >Trang cá nhân</router-link
        >
      </div>
      <div
        class="my-2"
        style="width: 100%; height: 1px; background-color: rgb(230, 234, 243)"
      ></div>
      <div style="width: 100%" class="btn btn-outline-info border-0" @click.stop="handleSignOut">
        Đăng xuất
      </div>
    </OverlayPanel>

    <!-- Thông báo -->
    <div class="me-2 fs-5 position-relative text-center" style="width: 35px" @click="toggleNotice">
      <font-awesome-icon :icon="faBell" style="color: white" />
      <span
        v-if="isReadNotice"
        class="notice position-absolute top-0 start-100 translate-middle bg-danger border border-light rounded-circle"
        style="padding: 4px; top: 4px !important"
      ></span>
    </div>
    <OverlayPanel ref="notice">
      <div v-if="notices.length == 0" class="d-flex" style="height: 100%; opacity: 0.7">
        Không có thông báo nào
      </div>
      <div style="width: 500px; user-select: none; cursor: pointer" v-else>
        <div
          v-for="(notice, index) in notices"
          :key="index"
          class="notice-items"
          :style="`border-color: ${notice.isRead ? 'rgba(128, 128, 128, 0.615)' : ' #569dbf'}`"
        >
          <p class="title fw-bolder">{{ notice.title }}</p>
          <p class="decs mt-1">{{ notice.noticeContent }}</p>
          <p class="time">
            {{
              modifyDateValue(notice.time.toString().slice(0, notice.time.toString().length - 29))
            }}
          </p>
        </div>
      </div>
    </OverlayPanel>
  </div>
</template>

<style scoped>
.header {
  position: fixed;
  align-items: center;
  top: 0;
  right: 0;
  width: 100%;
  height: 7vh;
  background-color: #569dbf;
  /* box-shadow: 0 0 30px rgba(128, 128, 128, 0.615); */
  user-select: none;
  z-index: 999;

  div {
    cursor: pointer;
  }
}

.notice-items {
  display: block;
  width: 100%;
  height: 60px;
  border-radius: 10px;
  text-decoration: none;
  padding-left: 10px;
  position: relative;
  color: var(--text-color);
  border-left: 10px solid #ccc;
  text-align: left;
}

.title {
  display: inline;
}

.time {
  position: absolute;
  bottom: 0;
  right: 10px;
  opacity: 0.6;
  margin: 0;
}

.notice-items + .notice-items {
  margin-top: 15px;
}

.notice-items:hover {
  background-color: rgba(142, 129, 129, 0.133);
}
</style>
