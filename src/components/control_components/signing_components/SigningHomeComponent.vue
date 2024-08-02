<script setup>
import { ref } from 'vue'

import { get, post } from '@/utils/httpRequest'

import { FilterMatchMode } from 'primevue/api'

import ListComponent from '../content_components/ListComponent.vue'
import * as pdfjsLib from 'pdfjs-dist/webpack'

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
    portfolio.value = data
    portfolio.value.exist = null
    portfolio.value.id = data._id
  } else {
    portfolio.value = data

    portfolio.value.id = data._id
    portfolio.value.exist = await get('/file', {
      dirName: 'portfolios',
      fileName: data.portfolio
    })
  }

  var pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 0.8,
    canvas = document.getElementById('pdfCanvas'),
    ctx = canvas.getContext('2d')
  // If absolute URL from the remote server is provided, configure the CORS
  // header on that server.
  var url = portfolio.value.exist.url

  /**
   * Get page info from document, resize canvas accordingly, and render page.
   * @param num Page number.
   */
  function renderPage(num) {
    pageRendering = true
    // Using promise to fetch the page
    pdfDoc.getPage(num).then(function (page) {
      var viewport = page.getViewport({ scale: scale })
      canvas.height = viewport.height
      canvas.width = viewport.width

      // Render PDF page into canvas context
      var renderContext = {
        canvasContext: ctx,
        viewport: viewport
      }
      var renderTask = page.render(renderContext)

      // Wait for rendering to finish
      renderTask.promise.then(function () {
        pageRendering = false
        if (pageNumPending !== null) {
          // New page rendering is pending
          renderPage(pageNumPending)
          pageNumPending = null
        }
      })
    })

    // Update page counters
    document.getElementById('page_num').textContent = num
  }

  /**
   * If another page rendering in progress, waits until the rendering is
   * finised. Otherwise, executes rendering immediately.
   */
  function queueRenderPage(num) {
    if (pageRendering) {
      pageNumPending = num
    } else {
      renderPage(num)
    }
  }

  /**
   * Displays previous page.
   */
  function onPrevPage() {
    if (pageNum <= 1) {
      return
    }
    pageNum--
    queueRenderPage(pageNum)
  }
  document.getElementById('prev').addEventListener('click', onPrevPage)

  /**
   * Displays next page.
   */
  function onNextPage() {
    if (pageNum >= pdfDoc.numPages) {
      return
    }
    pageNum++
    queueRenderPage(pageNum)
  }
  document.getElementById('next').addEventListener('click', onNextPage)

  /**
   * Asynchronously downloads PDF.
   */
  pdfjsLib.getDocument(url).promise.then(function (pdfDoc_) {
    pdfDoc = pdfDoc_
    document.getElementById('page_count').textContent = pdfDoc.numPages

    // Initial/first page rendering
    renderPage(pageNum)
  })
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
        isPortfolioShow.value = false

        const status = result.status
        if (status == 200) {
          uploadPortfolioResult.value = await post(`/signing/apply/${portfolio.value.id}/update`, {
            portfolio: portfolio.value.id + '.' + inputFilePortfolio.value.name.split('.')[1]
          })
          await handleSeePortfolio(portfolio.value)
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

    <Button label="Trang trước" severity="danger" id="prev" class="me-2 rounded"></Button>
    <Button label="Trang sau" severity="danger" id="next" class="rounded"></Button>
    <div class="my-2">
      Số trang hiện tại: <span id="page_num"></span> / <span id="page_count"></span>
    </div>
    <canvas
      v-show="portfolio.exist"
      style="display: block; width: 700px; margin: auto; box-shadow: 0 0 5px #ccc; padding: 10px"
      id="pdfCanvas"
    ></canvas>
    <label
      for="inputFilePortfolio"
      style="
        display: block;
        background-color: #ccc;
        padding: 8px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        display: inline-block;
        margin-top: 10px;
      "
      >Chọn hồ sơ</label
    >
    <input id="inputFilePortfolio" type="file" class="d-none" @change="handleFileChange" />
    <div class="my-3" ref="inputFilePortfolioFileChose"></div>
    <Button label="Gửi hồ sơ" @click="handleUploadPortfolio" severity="success" />
  </Dialog>
</template>

<style></style>
