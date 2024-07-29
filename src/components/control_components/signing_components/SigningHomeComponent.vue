<script setup>
import { ref } from 'vue'

import { get, post } from '@/utils/httpRequest'

import { FilterMatchMode } from 'primevue/api'

import ListComponent from '../content_components/ListComponent.vue'

const signingList = ref(null)
const signingHctList = ref(null)
const signingIpgList = ref(null)
const signingSentList = ref(null)
const signingPassedList = ref(null)
const signingFailedList = ref(null)

const filtersHct = ref(null)
const filtersIpg = ref(null)
const filtersSent = ref(null)
const filtersPassed = ref(null)
const filtersFailed = ref(null)

const signingStateDropdown = ref([])

const isPortfolioShow = ref(null)
const portfolio = ref({})
const portfolioIframe = ref(null)
const inputFilePortfolio = ref(null)
const inputFilePortfolioFileChose = ref(null)
const uploadPortfolioResult = ref(null)

const getSignings = async () => {
  let applies = await get(`/signing/apply`)
  applies = applies.reverse().map((a) => {
    a.birthDate = new Date(a.birthDate)
    a.createAt = new Date(a.createAt)
    a.order.type = orderType[a.order.type]
    return a
  })
  signingList.value = applies
  signingHctList.value = applies.filter((a) => a.state == 'hct')
  signingIpgList.value = applies.filter((a) => a.state == 'ipg')
  signingSentList.value = applies.filter((a) => a.state == 'sent')
  signingPassedList.value = applies.filter((a) => a.state == 'passed')
  signingFailedList.value = applies.filter((a) => a.state == 'failed')
}

const clearFiltersHct = () => {
  filtersHct.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
}

const clearFiltersIpg = () => {
  filtersIpg.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
}

const clearFiltersSent = () => {
  filtersSent.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
}

const clearFiltersPassed = () => {
  filtersPassed.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
}

const clearFiltersFailed = () => {
  filtersFailed.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
}

const initFilters = () => {
  filtersHct.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
  filtersIpg.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
  filtersSent.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
  filtersPassed.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
  filtersFailed.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
}

initFilters()

const handleSeePortfolio = async (data) => {
  isPortfolioShow.value = true
  if (!data.portfolio) {
    portfolio.value.exist = null
    portfolio.value.id = data._id
  } else {
    portfolio.value.id = data._id
    portfolio.value.exist = await get(
      '/file',
      {
        dirName: 'portfolios',
        fileName: data.portfolio
      },
      { responseType: 'blob' }
    )
    const url = window.URL.createObjectURL(portfolio.value.exist)
    portfolioIframe.value.src = url
  }
}

const handleUploadPortfolio = async () => {
  new Promise((resolve, reject) => {
    const formData = new FormData()

    formData.append('file', inputFilePortfolio.value)

    fetch(
      import.meta.env.VITE_VUE_APP_SERVER_URL +
        `/file?dirName=portfolios&fileName=${portfolio.value.id}`,
      {
        method: 'POST',
        body: formData
      }
    )
      .then((response) => response.json())
      .then(async (result) => {
        const status = result.status
        if (status == 200) {
          console.log(inputFilePortfolio.value)
          uploadPortfolioResult.value = await post(`/signing/apply/${portfolio.value.id}/update`, {
            portfolio: portfolio.value.id + '.' + inputFilePortfolio.value.name.split('.')[1]
          })
          console.log(uploadPortfolioResult.value)
        }
        resolve()
      })
      .catch((error) => {
        reject('Upload failed')
        console.error('Error:', error)
      })
  })
}

const handleFileChange = (e) => {
  const fileInput = e.target

  if (fileInput.files && fileInput.files[0]) {
    inputFilePortfolio.value = fileInput.files[0]
    inputFilePortfolioFileChose.value.innerText = fileInput.files[0].name
  }
}

const handleUpdateState = async (data, newValue) => {
  await post(`/signing/apply/${data._id}/update`, {
    state: newValue.code,
    timeModify: new Date().toISOString()
  })
  signingList.value = null
  await getSignings()
}

const orderType = {
  ck: 'Cơ khí',
  dm: 'Dệt may',
  os: 'Giúp việc',
  bv: 'Làm nông'
}

const columns = [
  {
    header: 'Thời gian gửi đơn',
    width: '8%',
    type: 'date',
    param: 'createAt'
  },
  {
    header: 'Họ tên',
    width: '15%',
    type: 'text',
    param: 'name'
  },
  {
    header: 'Ngày sinh',
    width: '10%',
    type: 'date',
    param: 'birthDate'
  },
  {
    header: 'Số điện thoại',
    width: '11%',
    type: 'text',
    param: 'phoneNumber'
  },
  {
    header: 'Email',
    width: '10%',
    type: 'text',
    param: 'email'
  },
  {
    header: 'Mã đơn đăng kí',
    width: '15%',
    type: 'text',
    param: 'order.orderCode'
  },
  {
    header: 'Loại đơn đăng kí',
    width: '10%',
    type: 'text',
    param: 'order.type'
  },
  {
    header: 'Trạng thái đơn đăng kí',
    width: '15%',
    type: 'dropdownTag',
    forbidChoseBack: true,
    param: 'state',
    label: 'text',
    key: 'code',
    value: signingStateDropdown,
    itemList: [
      { index: 0, code: 'hct', text: 'Chưa liên hệ', severity: 'warn' },
      { index: 1, code: 'ipg', text: 'Đã liên hệ đang chờ gửi hồ sơ', severity: 'info' },
      { index: 2, code: 'sent', text: 'Đã nộp hồ sơ đang chờ kiểm tra hồ sơ', severity: 'info' },
      { index: 3, code: 'passed', text: 'Hồ sơ hợp lệ', severity: 'success' },
      { index: 4, code: 'failed', text: 'Hồ sơ không hợp lệ', severity: 'danger' },
      { index: 5, code: 'halt', text: 'Cấm', severity: 'contrast' }
    ],
    dropdownFunction: (data, newValue) => {
      handleUpdateState(data, newValue)
    }
  },
  {
    header: 'Hồ sơ',
    width: '6%',
    type: 'button',
    iconPos: 'left',
    severity: 'info',
    label: 'Xem',
    icon: 'pi pi-file',
    buttonFunction: (data) => {
      handleSeePortfolio(data)
    }
  }
]

Promise.all([getSignings()])
</script>

<template>
  <TabView
    :pt="{
      inkbar: { style: 'background-color: #dc3545; height: 3px ' },
      navcontent: { class: 'mt-2' }
    }"
    class="card mb-6"
  >
    <TabPanel
      v-if="signingList"
      header="Chưa liên hệ"
      :pt="{
        headerAction: ({ context }) => ({
          style: { 'text-decoration': 'none', color: context.active ? '#dc3545' : '#64748b' },
          class: 'tabPanelTagA'
        })
      }"
    >
      <div class="signing__list card position-relative p-4">
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
          Đơn đăng kí chưa liên hệ
        </div>
        <div class="d-flex flex-row-reverse mb-3">
          <div class="d-flex align-items-center me-4 border-3 border-info p-2">
            <div class="me-2">Số lượng đơn đăng kí chưa liên hệ hiện tại:</div>
            <div>{{ signingHctList ? signingHctList.length : '' }}</div>
          </div>
        </div>
        <ListComponent
          v-if="signingList && signingHctList"
          v-model:filters="filtersHct"
          @clear-filter="clearFiltersHct"
          :items="signingHctList"
          :globalFilterFields="[
            'name, birthDate, phoneNumber, email, order.orderCode, order.orderType'
          ]"
          :tableFor="'đơn đăng kí'"
          :columns="columns"
          :type="'info'"
        >
        </ListComponent>
      </div>
    </TabPanel>
    <TabPanel
      v-if="signingList"
      header="Đã liên hệ đang chờ gửi hồ sơ"
      :pt="{
        headerAction: ({ context }) => ({
          style: { 'text-decoration': 'none', color: context.active ? '#dc3545' : '#64748b' },
          class: 'tabPanelTagA'
        })
      }"
    >
      <div class="signing__list card position-relative p-4">
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
          Đơn đăng kí đã liên hệ đang chờ gửi hồ sơ
        </div>
        <div class="d-flex flex-row-reverse mb-3">
          <div class="d-flex align-items-center me-4 border-3 border-info p-2">
            <div class="me-2">Số lượng đơn đăng kí đã liên hệ đang chờ gửi hồ sơ hiện tại:</div>
            <div>{{ signingIpgList ? signingIpgList.length : '' }}</div>
          </div>
        </div>
        <ListComponent
          v-if="signingList && signingIpgList"
          v-model:filters="filtersIpg"
          @clearFilter="clearFiltersIpg"
          :items="signingIpgList"
          :globalFilterFields="[
            'name, birthDate, phoneNumber, email, order.orderCode, order.orderType'
          ]"
          :tableFor="'đơn đăng kí'"
          :columns="columns"
          :type="'info'"
        >
        </ListComponent>
      </div>
    </TabPanel>
    <TabPanel
      v-if="signingList"
      header="Đã nộp hồ sơ đang chờ kiểm tra hồ sơ"
      :pt="{
        headerAction: ({ context }) => ({
          style: { 'text-decoration': 'none', color: context.active ? '#dc3545' : '#64748b' },
          class: 'tabPanelTagA'
        })
      }"
    >
      <div class="signing__list card position-relative p-4">
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
          Đơn đăng kí đã nộp hồ sơ đang chờ kiểm tra hồ sơ
        </div>
        <div class="d-flex flex-row-reverse mb-3">
          <div class="d-flex align-items-center me-4 border-3 border-info p-2">
            <div class="me-2">Số lượng đã nộp hồ sơ đang chờ kiểm tra hồ sơ hiện tại:</div>
            <div>{{ signingSentList ? signingSentList.length : '' }}</div>
          </div>
        </div>
        <ListComponent
          v-if="signingList && signingSentList"
          v-model:filters="filtersSent"
          @clearFilter="clearFiltersSent"
          :items="signingSentList"
          :globalFilterFields="[
            'name, birthDate, phoneNumber, email, order.orderCode, order.orderType'
          ]"
          :tableFor="'đơn đăng kí'"
          :columns="columns"
          :type="'info'"
        >
        </ListComponent>
      </div>
    </TabPanel>
    <TabPanel
      v-if="signingList"
      header="Hồ sơ hợp lệ"
      :pt="{
        headerAction: ({ context }) => ({
          style: { 'text-decoration': 'none', color: context.active ? '#dc3545' : '#64748b' },
          class: 'tabPanelTagA'
        })
      }"
    >
      <div class="signing__list card position-relative p-4">
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
          Đơn đăng kí có hồ sơ hợp lệ
        </div>
        <div class="d-flex flex-row-reverse mb-3">
          <div class="d-flex align-items-center me-4 border-3 border-info p-2">
            <div class="me-2">Số lượng đơn đăng kí có hồ sơ hợp lệ hiện tại:</div>
            <div>{{ signingPassedList ? signingPassedList.length : '' }}</div>
          </div>
        </div>
        <ListComponent
          v-if="signingList && signingPassedList"
          v-model:filters="filtersPassed"
          @clearFilter="clearFiltersPassed"
          :items="signingPassedList"
          :globalFilterFields="[
            'name, birthDate, phoneNumber, email, order.orderCode, order.orderType'
          ]"
          :tableFor="'đơn đăng kí'"
          :columns="columns"
          :type="'info'"
        >
        </ListComponent>
      </div>
    </TabPanel>
    <TabPanel
      v-if="signingList"
      header="Hồ sơ không hợp lệ"
      :pt="{
        headerAction: ({ context }) => ({
          style: { 'text-decoration': 'none', color: context.active ? '#dc3545' : '#64748b' },
          class: 'tabPanelTagA'
        })
      }"
    >
      <div class="signing__list card position-relative p-4">
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
          Đơn đăng kí có hồ sơ không hợp lệ
        </div>
        <div class="d-flex flex-row-reverse mb-3">
          <div class="d-flex align-items-center me-4 border-3 border-info p-2">
            <div class="me-2">Số lượng đơn đăng kí có hồ sơ không hợp lệ hiện tại:</div>
            <div>{{ signingFailedList ? signingFailedList.length : '' }}</div>
          </div>
        </div>
        <ListComponent
          v-if="signingList && signingFailedList"
          v-model:filters="filtersFailed"
          @clearFilter="clearFiltersFailed"
          :items="signingFailedList"
          :globalFilterFields="[
            'name, birthDate, phoneNumber, email, order.orderCode, order.orderType'
          ]"
          :tableFor="'đơn đăng kí'"
          :columns="columns"
          :type="'info'"
        >
        </ListComponent>
      </div>
    </TabPanel>
  </TabView>
  <Dialog
    v-if="isPortfolioShow"
    v-model:visible="isPortfolioShow"
    modal
    header="Thông tin hồ sơ"
    :style="{
      width: '75rem'
    }"
  >
    <div v-if="!portfolio.exist" class="my-3">
      <div class="mb-3 fw-bolder fs-3">Đơn này chưa có thông tin hồ sơ</div>
    </div>
    <iframe v-show="portfolio.exist" ref="portfolioIframe"></iframe>
    <label
      for="inputFilePortfolio"
      style="
        background-color: #ccc;
        padding: 8px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        display: inline-block;
      "
      >Chọn hồ sơ</label
    >
    <input id="inputFilePortfolio" type="file" class="d-none" @change="handleFileChange" />
    <div class="my-3" ref="inputFilePortfolioFileChose"></div>
    <Button label="Gửi hồ sơ" @click="handleUploadPortfolio" severity="success" />
  </Dialog>
</template>

<style></style>
