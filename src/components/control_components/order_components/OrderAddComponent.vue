<!-- eslint-disable no-constant-condition -->
<script setup>
import { ref } from 'vue'
import { post, get } from '@/utils/httpRequest'
import { onMounted } from 'vue'

import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'

import modifyDate from '@/helpers/modifyDate'
import FormCoverComponent from '../content_components/FormCoverComponent.vue'
import quillEditorModules from '@/helpers/quillEditorModules'

const addResult = ref(null)
const addResultVisible = ref(false)
const isParagraphShow = ref(false)

const orderEmployees = ref(null)

// các options lựa chọn
const isSmokeOptions = [
  { text: 'Cho phép hút thuốc', code: true },
  { text: 'Không cho phép hút thuốc', code: false }
]

const academyLevelOptions = [
  { text: 'Cơ sở', code: 'cs' },
  { text: 'Phổ thông', code: 'pt' },
  { text: 'Cao đẳng', code: 'cd' },
  { text: 'Đại học', code: 'dh' }
]

// do orderList bên ngoài đã sửa thuộc tính state này để phù hợp render ra nên sẽ không cần sửa tại đây
const stateOptions = [
  { text: 'Đang thực hiện', code: 'inprogress', severity: 'danger' },
  { text: 'Đã hoàn thành', code: 'completed', severity: 'success' }
]

const typeOptions = [
  { text: 'Cơ khí', code: 'ck' },
  { text: 'Dệt may', code: 'dm' },
  { text: 'Giúp việc', code: 'os' },
  { text: 'Làm nông', code: 'bv' }
]

// do orderList bên ngoài đã sửa thuộc tính isHot này để phù hợp render ra nên sẽ không cần sửa tại đây
const isHotOptions = [
  { text: 'Đang nổi bật', code: true, severity: 'success' },
  { text: 'Không nổi bật', code: false, severity: 'danger' }
]

const order = ref({
  orderName: null,
  companyName: null,
  companyAddress: null,
  jobDescription: null,
  quantityRequire: {},
  ageRequire: null,
  heightRequire: {},
  weightRequire: {},
  bodyRequire: {},
  academicLevelRequire: null,
  // lương thực tế /1000
  salary: null,
  timeNeeded: null,
  state: null,
  type: null,
  paragraph: null,
  isHot: null,
  employee: null
})
const imageOrder = ref(null)
let handleImageChange

const handleAddOrder = async () => {
  try {
    addResult.value = await post(`/order/order/create`, {
      order: {
        ...order.value,
        bodyRequire: {
          ...order.value.bodyRequire,
          isSmoke: order.value.bodyRequire.isSmoke.code
        },
        academicLevelRequire: order.value.academicLevelRequire.code,
        state: order.value.state.code,
        isHot: order.value.isHot.code,
        type: order.value.type.code,
        salary: order.value.salary / 1000,
        employee: order.value.employee._id
      }
    })
    addResultVisible.value = true
  } catch (e) {
    addResult.value = { response: { status: 500 } }
    addResultVisible.value = true
  }
}

const resetAddOrder = async () => {
  // reset kết quả thêm
  addResult.value = null

  // reset giá trị tài khoản
  order.value = {
    orderName: null,
    companyName: null,
    companyAddress: null,
    jobDescription: null,
    quantityRequire: {},
    ageRequire: null,
    heightRequire: {},
    weightRequire: {},
    bodyRequire: {},
    academicLevelRequire: null,
    // lương thực tế /1000
    salary: null,
    timeNeeded: null,
    state: null,
    type: null,
    paragraph: null,
    isHot: null,
    employee: null
  }

  // reset ảnh
  imageOrder.value = null
}

// lấy danh sách nhân viên đơn hàng để lựa chọn người chịu trách nhiệm đơn hàng
const getOrderEmployees = async () => {
  let employees = await get('/account/account_employee')
  employees = employees.filter((e) => e.role == 'ordering')
  employees = employees.map((e) => ({
    _id: e._id,
    name: e.person.name,
    birthDate: modifyDate(e.person.birthDate)
  }))
  orderEmployees.value = employees
}

// thay đổi hình ảnh
onMounted(() => {
  getOrderEmployees()
  resetAddOrder()
  handleImageChange = (e) => {
    const fileInput = e.target
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader()
      order.value.photoType = fileInput.files[0].name.split('.')[1]

      reader.onload = function (e) {
        imageOrder.value.src = e.target.result
        order.value.photo = e.target.result
      }

      reader.readAsDataURL(fileInput.files[0])
    }
  }
})
</script>

<template>
  <div class="card p-4 mb-6">
    <div class="order__info ms-5">
      <Dialog
        v-if="addResult"
        v-model:visible="addResultVisible"
        modal
        header="Kết quả thêm mới đơn hàng"
        :style="{
          width: '25rem',
          'font-weight': 'bold',
          'text-align': 'center'
        }"
      >
        <div :style="{ color: addResult.status === 200 ? 'green' : 'red' }">
          {{
            addResult.status && addResult.status == 200
              ? 'Thêm thành công'
              : addResult.response.status === 409
                ? 'Mã đơn hàng đã tồn tại'
                : 'Cần nhập đầy đủ trường thông tin'
          }}!!!
        </div>
      </Dialog>
      <div
        v-if="!(addResult && addResult.status && addResult.status == 200)"
        class="modify__choice d-flex flex-row-reverse"
      >
        <div class="btn btn-success me-1" style="width: 100px" @click="handleAddOrder">Thêm</div>
      </div>
      <form
        v-if="!(addResult && addResult.status && addResult.status == 200)"
        class="pe-4"
        v-show="!isParagraphShow"
      >
        <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
          <legend class="p-0 mb-4 fs-5 fw-bolder">Thông tin đơn hàng</legend>
          <div class="col-5 p-0 border-0">
            <input type="file" id="fileInput" class="d-none" @change="handleImageChange" />
            <label class="mb-4 d-flex justify-content-center" for="fileInput">
              <img
                :class="'hoverOpacity'"
                ref="imageOrder"
                alt="Click to upload"
                style="width: 300px"
              />
            </label>
          </div>

          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="orderName">Tên đơn hàng</label>
              <InputText id="orderName" v-model="order.orderName" />
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="companyName">Tên công ty</label>
              <InputText id="companyName" v-model="order.companyName" />
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="companyAddress">Địa chỉ công ty</label>
              <InputText id="companyAddress" v-model="order.companyAddress" />
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="jobDescription">Mô tả công việc</label>
              <Textarea id="jobDescription" v-model="order.jobDescription" />
            </div>
          </div>
        </fieldset>
        <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
          <legend class="p-0 fs-5 mb-3 fw-bolder">Thông tin yêu cầu của đơn hàng</legend>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="ageRequire">Độ tuổi yêu cầu</label>
              <InputNumber id="ageRequire" class="mb-3" v-model="order.ageRequire" />
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="academicLevelRequire">Trình độ bằng cấp yêu cầu</label>
              <Dropdown
                v-model="order.academicLevelRequire"
                :options="academyLevelOptions"
                optionLabel="text"
                input-id="academicLevelRequire"
                checkmark
                :highlightOnSelect="false"
                class="w-full"
              />
            </div>
          </div>
          <div class="col-5 p-0 my-4">
            <FormCoverComponent title="Số lượng yêu cầu">
              <div class="d-flex flex-row gap-1 mb-2 align-items-center">
                <label style="width: 40px" for="quantityRequireMale">Nam: </label>
                <InputNumber
                  v-model="order.quantityRequire.male"
                  id="quantityRequireMale"
                  :pt="{ root: { class: 'flex-grow-1' } }"
                />
              </div>
              <div class="d-flex flex-row gap-1 mb-2 align-items-center">
                <label style="width: 40px" for="quantityRequireFemale">Nữ: </label>
                <InputNumber
                  v-model="order.quantityRequire.female"
                  id="quantityRequireFemale"
                  :pt="{ root: { class: 'flex-grow-1' } }"
                />
              </div>
            </FormCoverComponent>
          </div>

          <div class="col-5 p-0 my-4">
            <FormCoverComponent title="Chiều cao yêu cầu">
              <div class="d-flex flex-row gap-1 mb-2 align-items-center">
                <label style="width: 40px" for="heightRequireMale">Nam: </label>
                <InputNumber
                  v-model="order.heightRequire.male"
                  id="heightRequireMale"
                  :pt="{ root: { class: 'flex-grow-1' } }"
                  suffix=" cm"
                />
              </div>
              <div class="d-flex flex-row gap-1 mb-2 align-items-center">
                <label style="width: 40px" for="heightRequireFemale">Nữ: </label>
                <InputNumber
                  v-model="order.heightRequire.female"
                  id="heightRequireFemale"
                  :pt="{ root: { class: 'flex-grow-1' } }"
                  suffix=" cm"
                />
              </div>
            </FormCoverComponent>
          </div>
          <div class="col-5 p-0 my-4">
            <FormCoverComponent title="Cân nặng yêu cầu">
              <div class="d-flex flex-row gap-1 mb-2 align-items-center">
                <label style="width: 40px" for="weightRequireMale">Nam: </label>
                <InputNumber
                  v-model="order.weightRequire.male"
                  id="weightRequireMale"
                  :pt="{ root: { class: 'flex-grow-1' } }"
                  suffix=" kg"
                />
              </div>
              <div class="d-flex flex-row gap-1 mb-2 align-items-center">
                <label style="width: 40px" for="weightRequireFemale">Nữ: </label>
                <InputNumber
                  v-model="order.weightRequire.female"
                  id="weightRequireFemale"
                  :pt="{ root: { class: 'flex-grow-1' } }"
                  suffix=" kg"
                />
              </div>
            </FormCoverComponent>
          </div>
          <div class="col-5 p-0 my-4">
            <FormCoverComponent title="Yêu cầu khác">
              <div class="d-flex flex-row gap-1 mb-2 align-items-center">
                <label style="width: 180px" for="bodyRequireEyesight"
                  >Trung bình độ rõ của mắt:
                </label>
                <InputNumber
                  v-model="order.bodyRequire.eyesight"
                  id="bodyRequireEyesight"
                  :pt="{ root: { class: 'flex-grow-1' } }"
                  suffix=" /10"
                  :max="10"
                  :min="0"
                />
              </div>
              <div class="d-flex flex-row gap-1 mb-2 align-items-center">
                <label style="width: 80px" for="bodyRequireSmoke">Hút thuốc: </label>
                <Dropdown
                  v-model="order.bodyRequire.isSmoke"
                  :options="isSmokeOptions"
                  optionLabel="text"
                  input-id="bodyRequireSmoke"
                  checkmark
                  :highlightOnSelect="false"
                  class="w-full"
                />
              </div>
            </FormCoverComponent>
          </div>
        </fieldset>
        <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
          <legend class="p-0 fs-5 mb-3 fw-bolder">Thông tin khác</legend>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="salary">Lương cơ bản: </label>
              <InputNumber
                v-model="order.salary"
                inputId="salary"
                mode="currency"
                currency="VND"
                locale="vi-VN"
                fluid
              />
            </div>
          </div>

          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="timeNeeded">Thời gian cần xuất khẩu: </label>
              <div class="flex-auto">
                <Calendar
                  v-model="order.timeNeeded"
                  showIcon
                  :showOnFocus="false"
                  inputId="timeNeeded"
                  dateFormat="dd/mm/yy"
                  :pt="{
                    root: {
                      style: 'width: 100%'
                    }
                  }"
                />
              </div>
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="state">Trạng thái đơn hàng: </label>
              <Dropdown
                v-model="order.state"
                :options="stateOptions"
                optionLabel="text"
                input-id="state"
                checkmark
                :highlightOnSelect="false"
                class="w-full"
              />
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="type">Loại đơn hàng: </label>
              <Dropdown
                v-model="order.type"
                :options="typeOptions"
                optionLabel="text"
                input-id="type"
                checkmark
                :highlightOnSelect="false"
                class="w-full"
              />
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="isHot">Đang nổi bật: </label>
              <Dropdown
                v-model="order.isHot"
                :options="isHotOptions"
                optionLabel="text"
                input-id="isHot"
                checkmark
                :highlightOnSelect="false"
                class="w-full"
              />
            </div>
          </div>
          <div class="col-5 p-0" v-if="orderEmployees">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="employee">Nhân viên quản lí đơn hàng: </label>
              <Dropdown
                v-model="order.employee"
                :options="orderEmployees"
                input-id="employee"
                checkmark
                :highlightOnSelect="false"
                class="w-full"
              >
                <template #option="slotProps">
                  <span>{{ slotProps.option.name }} - {{ slotProps.option.birthDate }}</span>
                </template>
                <template #value="slotProps">
                  <span v-if="slotProps.value">
                    {{ slotProps.value.name }} - {{ slotProps.value.birthDate }}
                  </span>
                  <span v-else style="color: #ccc">Nhân viên quản lí đơn hàng này </span>
                </template>
              </Dropdown>
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="">Sửa đoạn văn cho đơn hàng: </label>
              <Button
                icon="pi pi-info-circle"
                label="Xem đoạn văn"
                severity="secondary"
                style="width: 150px; margin-top: 10px"
                @click="isParagraphShow = true"
              />
            </div>
          </div>
        </fieldset>
      </form>
      <div class="my-6" v-show="isParagraphShow">
        <Editor
          v-model="order.paragraph"
          editorStyle="height: 320px, width: 50%"
          :modules="quillEditorModules"
          :pt="{ toolbar: { style: 'display: none;' } }"
          theme="snow"
          @load="
            ({ instance }) => {
              instance.root.innerHTML = order.paragraph
            }
          "
        />
        <div class="d-flex justify-content-end">
          <Button
            icon="pi pi-info-circle"
            label="Tắt xem đoạn văn"
            severity="secondary"
            style="width: 180px; margin-top: 20px"
            @click="isParagraphShow = false"
          />
        </div>
      </div>
      <div
        v-if="addResult && addResult.status && addResult.status == 200"
        class="d-flex justify-content-center py-2"
      >
        <Button
          label="Tiếp tục thêm mới đơn hàng"
          severity="secondary"
          icon="pi pi-user-plus"
          iconPos="right"
          @click="resetAddOrder()"
        ></Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hoverOpacity:hover {
  opacity: 0.6;
  cursor: pointer;
}
</style>
