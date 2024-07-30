<script setup>
import { ref } from 'vue'

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import { get } from '@/utils/httpRequest'

import { FilterMatchMode } from 'primevue/api'

import ListComponent from '../content_components/ListComponent.vue'
import NewsInfoComponent from './NewsInfoComponent.vue'

const newsList = ref(null)
const newsOutstandingList = ref(null)
const newsFocalList = ref(null)

const newsInfoShow = ref(null)

const isNewsShow = ref(false)

const filtersOutstanding = ref()
const filtersFocal = ref()

const getNews = async () => {
  let news = await get(`/news`)
  news = news.reverse().map((n) => {
    if (n.timeOutstandingRelease) {
      n.timeOutstandingRelease = new Date(n.timeOutstandingRelease)
    }
    if (n.showOnHome == null || n.showOnHome == undefined || n.showOnHome == 4) {
      n.showOnHome = { text: 'Không xuất hiện', severity: 'danger' }
    } else {
      n.showOnHome = { text: 'Có xuất hiện', severity: 'success' }
    }
    n.type = typeOptions.find((t) => t.code == n.type)
    n.isForeignNews = isForeignOptions.find((t) => t.code == !!n.isForeignNews)
    return n
  })
  newsList.value = news
  newsOutstandingList.value = news.filter((n) => n.type.code == 'outstanding')
  newsFocalList.value = news.filter((n) => n.type.code == 'focal')
}

const clearFiltersOutstanding = () => {
  filtersOutstanding.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
}

const clearFiltersFocal = () => {
  filtersFocal.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
}

const initFilters = () => {
  filtersOutstanding.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
  filtersFocal.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
}

initFilters()

const handleSeeNews = (data) => {
  const _new = newsList.value.find((n) => n._id == data._id)
  if (_new) {
    newsInfoShow.value = _new
    isNewsShow.value = true
  }
}

const typeOptions = [
  { text: 'Tin tức nổi bật', code: 'outstanding', severity: 'warn' },
  { text: 'Tiêu điểm', code: 'focal', severity: 'danger' }
]

const isForeignOptions = [
  { text: 'Tin tức nước ngoài', code: true, severity: 'danger' },
  { text: 'Tin tức trong nước', code: false, severity: 'success' }
]

const columnsOutstanding = [
  {
    header: 'Ảnh',
    width: '10%',
    type: 'image',
    param: 'pictureBase64'
  },
  {
    header: 'Tiêu đề',
    width: '15%',
    type: 'text',
    param: 'title'
  },
  {
    header: 'Nội dung',
    width: '23%',
    type: 'text',
    param: 'content'
  },
  {
    header: 'Thời gian đăng',
    width: '15%',
    type: 'date',
    includeTime: true,
    param: 'timeOutstandingRelease'
  },
  {
    header: 'Loại tin tức',
    width: '10%',
    type: 'tag',
    param: 'type.text',
    severity: 'type.severity'
  },
  {
    header: 'Tin tức trong nước?',
    width: '10%',
    type: 'tag',
    param: 'isForeignNews.text',
    severity: 'isForeignNews.severity'
  },
  {
    header: 'Có xuất hiện ở bảng tin hay không?',
    width: '12%',
    type: 'tag',
    param: 'showOnHome.text',
    severity: 'showOnHome.severity'
  },
  {
    header: 'Xem',
    width: '5%',
    type: 'button',
    iconPos: 'right',
    severity: 'info',
    label: 'Xem',
    icon: 'pi pi-arrow-right',
    buttonFunction: (data) => {
      handleSeeNews(data)
    }
  }
]

const columnsFocal = [
  {
    header: 'Ảnh',
    width: '10%',
    type: 'image',
    param: 'pictureBase64'
  },
  {
    header: 'Tiêu đề lớn của tiêu điểm',
    width: '10%',
    type: 'text',
    param: 'focalTitle'
  },
  {
    header: 'Tiêu đề',
    width: '15%',
    type: 'text',
    param: 'title'
  },
  {
    header: 'Nội dung',
    width: '23%',
    type: 'text',
    param: 'content'
  },

  {
    header: 'Loại tin tức',
    width: '10%',
    type: 'tag',
    param: 'type.text',
    severity: 'type.severity'
  },
  {
    header: 'Tin tức trong nước?',
    width: '10%',
    type: 'tag',
    param: 'isForeignNews.text',
    severity: 'isForeignNews.severity'
  },
  {
    header: 'Có xuất hiện ở bảng tin hay không?',
    width: '17%',
    type: 'tag',
    param: 'showOnHome.text',
    severity: 'showOnHome.severity'
  },
  {
    header: 'Xem',
    width: '5%',
    type: 'button',
    iconPos: 'right',
    severity: 'info',
    label: 'Xem',
    icon: 'pi pi-arrow-right',
    buttonFunction: (data) => {
      handleSeeNews(data)
    }
  }
]

Promise.all([getNews()])
</script>

<template>
  <TabView
    v-if="!isNewsShow"
    :pt="{
      inkbar: { style: 'background-color: #dc3545; height: 3px ' },
      navcontent: { class: 'mt-2' }
    }"
    class="card mb-6"
  >
    <TabPanel
      header="Tin tức nổi bật"
      :pt="{
        headerAction: ({ context }) => ({
          style: { 'text-decoration': 'none', color: context.active ? '#dc3545' : '#64748b' },
          class: 'tabPanelTagA'
        })
      }"
    >
      <div class="order__list card position-relative p-4">
        <div
          style="
            text-transform: uppercase;
            color: #ccc;
            top: 20px;
            left: 20px;
            pointer-events: none;
          "
          class="position-absolute fs-6 fw-bolder"
        >
          Tin tức nổi bật
        </div>
        <div class="d-flex flex-row-reverse mb-3">
          <div class="d-flex align-items-center me-4 border-3 border-info p-2">
            <div class="me-2">Số lượng tin tức nổi bật hiện tại:</div>
            <div>{{ newsOutstandingList ? newsOutstandingList.length : '' }}</div>
          </div>
        </div>
        <ListComponent
          v-if="newsList && newsOutstandingList"
          v-model:filters="filtersOutstanding"
          @clear-filter="clearFiltersOutstanding"
          :items="newsOutstandingList"
          :globalFilterFields="[
            'title',
            'content',
            'timeOutstandingRelease',
            'showOnHome.text',
            'isForeignNews.text'
          ]"
          :tableFor="'tin tức'"
          :columns="columnsOutstanding"
          :type="'info'"
        >
        </ListComponent>
      </div>
    </TabPanel>
    <TabPanel
      header="Tiêu điểm"
      :pt="{
        headerAction: ({ context }) => ({
          style: { 'text-decoration': 'none', color: context.active ? '#dc3545' : '#64748b' },
          class: 'tabPanelTagA'
        })
      }"
    >
      <div class="order__list card position-relative p-4">
        <div
          style="
            text-transform: uppercase;
            color: #ccc;
            top: 20px;
            left: 20px;
            pointer-events: none;
          "
          class="position-absolute fs-6 fw-bolder"
        >
          Tiêu điểm
        </div>
        <div class="d-flex flex-row-reverse mb-3">
          <div class="d-flex align-items-center me-4 border-3 border-info p-2">
            <div class="me-2">Số lượng tiêu điểm hiện tại:</div>
            <div>{{ newsFocalList ? newsFocalList.length : '' }}</div>
          </div>
        </div>
        <ListComponent
          v-if="newsList && newsFocalList"
          v-model:filters="filtersFocal"
          @clearFilter="clearFiltersFocal"
          :items="newsFocalList"
          :globalFilterFields="[
            'title',
            'content',
            'timeOutstandingRelease',
            'showOnHome.text',
            'isForeignNews'
          ]"
          :tableFor="'tiêu điểm'"
          :columns="columnsFocal"
          :type="'info'"
        >
        </ListComponent>
      </div>
    </TabPanel>
  </TabView>

  <div v-if="isNewsShow" class="card pt-3">
    <div class="d-flex justify-content-between my-2 pe-5">
      <div
        @click="
          async () => {
            await getNews()
            isNewsShow = false
          }
        "
        class="ms-4 mb-3 btn btn-danger rounded-circle text-light"
        style="height: 35px"
      >
        <font-awesome-icon :icon="faArrowLeft" />
      </div>
      <NewsInfoComponent style="flex: 1" :news="newsInfoShow"></NewsInfoComponent>
    </div>
  </div>
</template>

<style></style>
