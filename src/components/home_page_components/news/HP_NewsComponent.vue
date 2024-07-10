<script setup>
import { ref } from 'vue'
import modifyDate from '@/helpers/modifyDate'

const props = defineProps(['props'])
const attrs = props.props

// kiểm tra loại hình trình bày nếu 1 là dạng cột, 2 là kiểu có ảnh nhưng hàng ngang, 0 là kiểu hàng ngang và không có ảnh
const checkDisplay = (type, hasImg) => {
  if (type == 'col') {
    return 1
  } else if (hasImg) {
    return 2
  } else {
    return 0
  }
}

let display = checkDisplay(attrs.type, attrs.hasImg)
const news = ref(attrs.news)
</script>

<template>
  <div
    :class="`news p-0 ${attrs.type == 'row' ? 'row' : 'col'}`"
    style="text-transform: capitalize"
  >
    <RouterLink
      v-if="attrs.hasImg"
      class="d-inline-block"
      :class="attrs.type == 'row' ? 'col-4  p-0 me-3' : 'w-100  mb-1'"
      :to="{
        name: 'hp_news_view',
        params: {
          isForeign: !!news.isForeignNews,
          newsId: news._id
        }
      }"
    >
      <img :src="news.pictureBase64" class="w-full rounded" />
    </RouterLink>

    <div v-if="display == 0" class="time col-4 d-flex align-items-center">
      <span class="pi pi-clock me-2" style="font-size: 13px"></span>
      <span style="margin-top: -3px">{{ modifyDate(news.timeOutstandingRelease) }}</span>
    </div>
    <div :class="attrs.type == 'row' ? 'col-7 p-0' : ''">
      <div
        :class="`title my-1 ${display == 1 ? 'fs-5 fw-bolder' : display == 2 ? 'fs-6 fw-bolder' : 'fs-6'}`"
      >
        <RouterLink
          class="d-inline-block"
          :to="{
            name: 'hp_news_view',
            params: {
              isForeign: !!news.isForeignNews,
              newsId: news._id
            }
          }"
        >
          {{ news.title }}
        </RouterLink>
      </div>
      <div v-if="display != 0" class="time d-flex align-items-center">
        <span class="pi pi-clock me-2" style="font-size: 13px"></span>
        <span style="margin-top: -3px">{{ modifyDate(news.timeOutstandingRelease) }}</span>
      </div>
      <div v-if="attrs.type == 'col'" class="content mt-1">
        {{ news.content }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.news {
  width: 100%;
}

.title:hover {
  color: rgb(255, 47, 47);
}

.time {
  color: #7f7f7f82;
  font-size: 13px;
}

.content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* Số dòng hiển thị */
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
