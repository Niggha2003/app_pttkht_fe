<script setup>
import HP_NewsComponent from '@/components/home_page_components/news/HP_NewsComponent.vue'
import { onBeforeMount, onUpdated, ref } from 'vue'
import { get, post } from '@/utils/httpRequest'
import HP_NewsMultiSelectComponent from '@/components/home_page_components/news/HP_NewsMultiSelectComponent.vue'

const isHomePageModify = defineModel('isHomePageModify')

// giá trị function được truyền ra ngoài cho component home có thể thực thi
let updateFunction = defineModel('updateFunction')

const newses = ref(null)
const foreign_newses = ref(null)
const company_newses = ref(null)
const company_news0 = ref(null)
const company_news1 = ref(null)
const company_news2 = ref(null)
const foreign_news = ref(null)
const isUpdating = ref(false)

const getNews = async () => {
  let newsArray = await get('/news')
  newses.value = newsArray.filter((news) => news.type == 'outstanding').reverse()
  foreign_newses.value = newses.value.filter((news) => news.isForeignNews)
  company_newses.value = newses.value.filter((news) => !news.isForeignNews)
  // lọc các tin tức của công ty được xuất hiện ở bảng tin
  company_news0.value = newses.value.filter(
    (news) => !news.isForeignNews && news.showOnHome != null && news.showOnHome == 0
  )
  company_news1.value = newses.value.filter(
    (news) => !news.isForeignNews && news.showOnHome != null && news.showOnHome == 1
  )
  company_news2.value = newses.value.filter(
    (news) => !news.isForeignNews && news.showOnHome != null && news.showOnHome == 2
  )
  // lọc các tin tức nước ngoài được xuất hiện ở bảng tin
  foreign_news.value = newses.value.filter(
    (news) => news.isForeignNews && news.showOnHome != null && news.showOnHome == 0
  )
}

onBeforeMount(async () => {
  await getNews()
})

// thay đổi updateFunction để truyền ra ngoài cho component home thực thi mỗi khi chọn update
updateFunction.value = async () => {
  let result
  for (const news of newses.value) {
    if (news.showOnHome != null) {
      result = await post(`/news/${news._id}/update`, { showOnHome: 4 })
    }
  }
  for (const news of company_news0.value) {
    result = await post(`/news/${news._id}/update`, { showOnHome: 0 })
  }
  for (const news of company_news1.value) {
    result = await post(`/news/${news._id}/update`, { showOnHome: 1 })
  }
  for (const news of company_news2.value) {
    result = await post(`/news/${news._id}/update`, { showOnHome: 2 })
  }
  for (const news of foreign_news.value) {
    result = await post(`/news/${news._id}/update`, { showOnHome: 0 })
  }

  return result
}

onUpdated(() => {
  setTimeout(() => {
    isUpdating.value = false
  }, 150)
})
</script>

<template>
  <div class="p-5" style="background-color: white">
    <div
      class="card d-flex align-items-center container border-0"
      style="padding: 40px 30px; position: relative"
    >
      <div
        v-if="isHomePageModify && !isUpdating && newses"
        style="position: absolute; top: 0; left: -30px"
        class="d-flex"
      >
        <HP_NewsMultiSelectComponent
          style="width: 200px !important; margin-right: 20px"
          v-model:choices="company_news0"
          v-model:options="company_newses"
          v-model:isUpdating="isUpdating"
          v-model:exceptionChoices1="company_news1"
          v-model:exceptionChoices2="company_news2"
          :optionsLabel="'title'"
          :placeholder="'Tin tức 1'"
          :selectionLimit="1"
        ></HP_NewsMultiSelectComponent>
        <HP_NewsMultiSelectComponent
          style="width: 200px !important; margin-right: 20px"
          v-model:choices="company_news1"
          v-model:options="company_newses"
          v-model:isUpdating="isUpdating"
          v-model:exceptionChoices1="company_news0"
          v-model:exceptionChoices2="company_news2"
          :optionsLabel="'title'"
          :placeholder="'Tin tức 2'"
          :selectionLimit="2"
        ></HP_NewsMultiSelectComponent>
        <HP_NewsMultiSelectComponent
          style="width: 200px !important; margin-right: 20px"
          v-model:choices="company_news2"
          v-model:options="company_newses"
          v-model:isUpdating="isUpdating"
          v-model:exceptionChoices1="company_news0"
          v-model:exceptionChoices2="company_news1"
          :optionsLabel="'title'"
          :placeholder="'Tin tức 3'"
          :selectionLimit="3"
        ></HP_NewsMultiSelectComponent>
      </div>
      <div v-if="isHomePageModify && newses" style="position: absolute; top: 0; right: -30px">
        <HP_NewsMultiSelectComponent
          style="width: 200px !important"
          v-model:choices="foreign_news"
          v-model:options="foreign_newses"
          :optionsLabel="'title'"
          :placeholder="'Tin tức nước ngoài'"
          :selectionLimit="1"
        ></HP_NewsMultiSelectComponent>
      </div>

      <div class="row justify-content-between mb-3" style="width: 80%">
        <div
          class="col-sm-12 col-lg-8 p-0 row justify-content-between fw-bolder fs-2 text-danger border-bottom border-contrast"
        >
          <RouterLink
            :to="{ name: 'hp_news_view', params: { isForeign: false } }"
            class="company__news__title position-relative p-0 d-inline-block"
            style="width: auto"
            >Bản tin Mitaco
          </RouterLink>
        </div>
        <RouterLink
          :to="{ name: 'hp_news_view', params: { isForeign: true } }"
          class="col-4 p-0 d-none d-lg-block fw-bolder fs-2 text-danger"
          style="margin-right: -15px"
        >
          Tin tức nước ngoài
        </RouterLink>
      </div>
      <div class="row justify-content-between" style="width: 80%">
        <div
          v-if="newses"
          class="col-sm-12 col-lg-8 p-0 row justify-content-between position-relative"
        >
          <div v-if="company_news0[0]" class="col-5 p-0">
            <HP_NewsComponent
              :props="{
                type: 'col',
                hasImg: true,
                news: company_news0[0]
              }"
            ></HP_NewsComponent>
          </div>
          <div class="col-6 p-0">
            <!-- tin có ảnh -->

            <HP_NewsComponent
              v-if="company_news1[1]"
              :props="{
                type: 'row',
                hasImg: true,
                news: company_news1[0]
              }"
              class="pb-3"
            ></HP_NewsComponent>

            <HP_NewsComponent
              v-if="company_news1[1]"
              :props="{
                type: 'row',
                hasImg: true,
                news: company_news1[1]
              }"
              class="pb-3"
            ></HP_NewsComponent>

            <!-- tin không có ảnh -->

            <HP_NewsComponent
              v-if="company_news2[2]"
              :props="{ type: 'row', hasImg: false, news: company_news2[0] }"
              class="border-bottom border-contrast py-2"
            ></HP_NewsComponent>

            <HP_NewsComponent
              v-if="company_news2[2]"
              :props="{ type: 'row', hasImg: false, news: company_news2[1] }"
              class="border-bottom border-contrast py-2"
            ></HP_NewsComponent>

            <HP_NewsComponent
              v-if="company_news2[2]"
              :props="{ type: 'row', hasImg: false, news: company_news2[2] }"
              class="py-2"
            ></HP_NewsComponent>
          </div>
          <RouterLink
            :to="{ name: 'hp_news_view', params: { isForeign: false } }"
            class="d-inline-block position-absolute fw-bolder text-info hoverRed"
            style="bottom: -10px; width: 145px"
            >Xem thêm tin tức</RouterLink
          >
        </div>
        <div
          class="col-4 d-none d-lg-block p-0"
          style="margin-right: -15px; background-color: #aed9ff; border-radius: 10px"
        >
          <HP_NewsComponent
            v-if="foreign_news && foreign_news[0]"
            :props="{
              type: 'col',
              hasImg: true,
              news: foreign_news[0]
            }"
            class="p-4"
          ></HP_NewsComponent>

          <RouterLink
            :to="{ name: 'hp_news_view', params: { isForeign: true } }"
            class="d-inline-block py-2 my-3 ms-3 fw-bolder text-info hoverRed"
            >Xem thêm tin tức
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.company__news__title::before {
  content: '';
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 120%;
  height: 1.5px;
  background-color: rgba(var(--bs-danger-rgb), var(--bs-text-opacity)) !important;
}

.hoverRed:hover {
  color: rgb(251, 40, 40) !important;
}
</style>
