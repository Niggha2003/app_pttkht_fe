<!-- eslint-disable no-unused-vars -->
<script setup>
import { faBell } from '@fortawesome/free-regular-svg-icons'
import { ref } from 'vue'
import Cookies from 'js-cookie'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import importImage from '@/helpers/importImage'

const notices = ref([])
const isReadNotice = ref(false)
const store = useStore()
const router = useRouter()

const user = store.state.user

const accountImg = importImage('user', user.photo)

const handleOpenTooltip = (e) => {
  if (e.target.childNodes) {
    e.target.childNodes.forEach((child) => {
      if (child.classList.contains('tooltip')) {
        child.classList.toggle('show')
      }
    })
  }

  if (e.target.nextElementSibling && e.target.nextElementSibling.classList.contains('tooltip')) {
    e.target.nextElementSibling.classList.toggle('show')
  }
}

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

window.addEventListener('click', (e) => {
  const tooltipShow = document.querySelectorAll('.tooltip.show')
  if (
    !e.target.classList.contains('tooltip') &&
    !e.target.classList.contains('tooltip-father') &&
    !e.target.classList.contains('tooltip-inner-child') &&
    !e.target.classList.contains('tooltip-inner') &&
    tooltipShow
  ) {
    tooltipShow.forEach((i) => {
      if (i.classList.contains('show')) {
        i.classList.remove('show')
      }
    })
  }
})

const handleSignOut = () => {
  store.commit('login', false)
  sessionStorage.removeItem('user')
  Cookies.set('jwt-token', '', { expires: 0 })
  router.push('/login')
}
</script>

<template>
  <div class="header d-flex flex-row-reverse pe-1 border-bottom border-2 border-danger">
    <!-- <div
      class="tooltip-father rounded-circle me-1 bg-image position-relative"
      :style="`background-image: url(${accountImg})`"
      @click="handleOpenTooltip"
    >
      <div class="tooltip bs-tooltip-bottom">
        <div class="tooltip-arrow"></div>
        <div class="tooltip-inner">
          <div class="btn btn-outline-danger btn-tooltip-custom tooltip-inner-child" @click.stop>
            Trang cá nhân
          </div>
          <div
            class="btn btn-outline-danger btn-tooltip-custom tooltip-inner-child"
            @click.stop="handleSignOut"
          >
            Đăng xuất
          </div>
        </div>
      </div>
    </div> -->
    <!-- <div class="me-2 mt-1 fs-5 position-relative" @click="handleOpenTooltip">
      <font-awesome-icon class="tooltip-father p-1" :icon="faBell" />
      <div class="tooltip bs-tooltip-bottom" @click.stop>
        <div class="tooltip-arrow"></div>
        <div class="tooltip-inner" style="min-height: 350px; width: 600px; max-width: 600px">
          <div v-if="notices.length == 0" class="d-flex" style="height: 100%; opacity: 0.7">
            Không có thông báo nào
          </div>
          <div v-else>
            <div
              v-for="(notice, index) in notices"
              :key="index"
              class="notice-items tooltip-inner-child"
              :style="`border-color: ${notice.isRead ? 'rgba(128, 128, 128, 0.615)' : 'rgb(247, 101, 101)'}`"
            >
              <p class="title fw-bolder">{{ notice.title }}</p>
              <p class="decs mt-1">{{ notice.noticeContent }}</p>
              <p class="time">
                {{
                  modifyDateValue(
                    notice.time.toString().slice(0, notice.time.toString().length - 29)
                  )
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <span
        v-if="isReadNotice"
        class="notice position-absolute top-0 start-100 translate-middle padding-4 bg-danger border border-light rounded-circle"
        @click.stop
      ></span>
    </div> -->
  </div>
</template>

<style scoped>
.header {
  position: fixed;
  align-items: center;
  top: 0;
  right: 0;
  width: 100%;
  background-color: white;
  box-shadow: 0 0 30px rgba(128, 128, 128, 0.615);
  user-select: none;
  z-index: 1000;

  div {
    cursor: pointer;
  }
}

.padding-4 {
  top: 4px !important;
  padding: 4px;
}

.bg-image {
  width: 35px;
  min-height: 35px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.tooltip {
  right: 0;
}

.tooltip-arrow {
  right: 11px;
}

.bs-tooltip-bottom .tooltip-arrow::before {
  border-bottom-color: rgb(247, 101, 101);
}

.tooltip-inner {
  padding: 5px 0;
  box-shadow: 0 0 5px rgba(128, 128, 128, 0.615);
  overflow-y: scroll;
}

.btn-tooltip-custom {
  border: none;
  width: 100%;
}

.btn-tooltip-custom:hover {
  background-color: rgb(227, 93, 106);
}

.notice-items {
  display: block;
  width: 100%;
  height: 60px;
  border-radius: 10px;
  text-decoration: none;
  padding-left: 10px;
  position: relative;
  border-left: 10px solid #64d389;
  color: var(--text-color);
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
