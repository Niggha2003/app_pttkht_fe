<script setup>
import { ref, onMounted } from 'vue'

import HP_ContentCoverComponent from '@/components/home_page_components/content/HP_ContentCoverComponent.vue'

import Carousel from 'primevue/carousel'
import { get } from '@/utils/httpRequest'

const focalNews = ref()

onMounted(async () => {
  await getNews()
})

const getNews = async () => {
  focalNews.value = await get('/news')
  focalNews.value = focalNews.value.filter((news) => news.type == 'focal')
}

const responsiveOptions = ref([
  {
    breakpoint: '1400px',
    numVisible: 1,
    numScroll: 1
  },
  {
    breakpoint: '1199px',
    numVisible: 1,
    numScroll: 1
  },
  {
    breakpoint: '767px',
    numVisible: 1,
    numScroll: 1
  },
  {
    breakpoint: '575px',
    numVisible: 1,
    numScroll: 1
  }
])
</script>

<template>
  <div style="background-color: #ff7575; padding: 50px 0">
    <HP_ContentCoverComponent
      title="Tiêu điểm"
      icon="pi pi-megaphone"
      class="card d-flex align-items-center container border-0"
      style="margin: auto"
    >
      <Carousel
        :value="focalNews"
        :numVisible="1"
        :numScroll="1"
        :responsiveOptions="responsiveOptions"
        circular
        :autoplayInterval="5000"
        style="width: 80%"
        :pt="{
          previousbutton: {
            class: 'carousel_button carousel_button--left'
          },
          nextbutton: {
            class: 'carousel_button carousel_button--right'
          },
          indicatorButton: ({ context }) => ({
            style: context.highlighted ? 'background-color: #fc6e48 !important' : ''
          })
        }"
      >
        <template #item="slotProps">
          <div class="d-flex justify-content-between rounded m-2 p-4">
            <div class="d-flex mb-4" style="width: 45%">
              <div class="mx-auto">
                <img
                  :src="slotProps.data.pictureBase64"
                  :alt="slotProps.data.title"
                  class="rounded"
                  style="width: 100%; height: 300px; box-shadow: 0 0 10px #ccc"
                />
              </div>
            </div>
            <div class="mb-4" style="width: 49%; text-transform: capitalize">
              <div
                class="fs-2 text-danger fw-bolder"
                style="padding-bottom: 5px; border-bottom: solid 2px #fad8d8"
              >
                {{ slotProps.data.focalTitle }}
              </div>
              <div class="fs-5 fw-bolder my-2">
                {{ slotProps.data.title }}
              </div>
              <div class="fs-6 content my-2">{{ slotProps.data.content }}</div>
            </div>
          </div>
        </template>
      </Carousel>
    </HP_ContentCoverComponent>
  </div>
</template>

<style>
.carousel_button {
  width: 30px;
  height: 60px;
  background-color: rgba(248, 140, 110, 0.73);
  color: white !important;
}

.carousel_button--left {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.carousel_button--right {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

.carousel_button:hover {
  background-color: #fc6e48 !important;
}
</style>

<style scoped>
.content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6; /* Số dòng hiển thị */
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
