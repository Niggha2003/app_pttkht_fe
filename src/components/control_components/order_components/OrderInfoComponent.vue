<!-- eslint-disable no-constant-condition -->
<script setup>
import { ref } from 'vue'
import { get, post } from '@/utils/httpRequest'
import { onMounted } from 'vue'

import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'

import FormCoverComponent from '@/components/control_components/content_components/FormCoverComponent.vue'

import modifyDate from '@/helpers/modifyDate'
import importImage from '@/helpers/importImage'

const props = defineProps(['order'])
const order = ref(props.order)

const isDisabled = ref(true)
const updateResult = ref(null)

const employee = ref(null)

const imageOrder = ref(null)
let handleImageChange

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
  { text: 'Dệt may', code: 'ck' },
  { text: 'Giúp việc', code: 'ck' },
  { text: 'Làm nông', code: 'ck' }
]

// khởi tạo các giá trị hiển thị
order.value.bodyRequire.isSmoke = isSmokeOptions.find(
  (s) => s.code == order.value.bodyRequire.isSmoke
)
order.value.academicLevelRequire = academyLevelOptions.find(
  (a) => a.code == order.value.academicLevelRequire
)
order.value.timePosted = new Date(order.value.timePosted)
order.value.timeNeeded = new Date(order.value.timeNeeded)
order.value.type = typeOptions.find((t) => t.code == order.value.type)
order.value.salary = order.value.salary * 1000

const orderImg = importImage('order', order.value.photo)

// gửi dữ liệu update
const handleUpdateInfo = async () => {
  try {
    updateResult.value = await post(`/order/order_employee/${order.value._id}/update`, {
      orderEmployee: {
        ...order.value
      }
    })
  } catch (e) {
    updateResult.value = e
  }
  setTimeout(() => {
    updateResult.value = null
  }, 1000)
}

// lấy thông tin người phụ trách đơn hàng
const getEmployee = async () => {
  employee.value = await get(`/account/account_employee/${order.value.employee._id}`)
}

onMounted(async () => {
  await getEmployee()
  // thay đổi hình ảnh
  handleImageChange = (e) => {
    const fileInput = e.target

    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader()
      order.value.person.photoType = fileInput.files[0].name.split('.')[1]

      reader.onload = function (e) {
        imageOrder.value.src = e.target.result
        order.value.person.photo = e.target.result
      }

      reader.readAsDataURL(fileInput.files[0])
    }
  }
})

// các hàm xử lí bật tắt chế độ sửa
const handleChangeModifyMode = (state) => {
  isDisabled.value = state
}
</script>

<template>
  <div class="worker__info ms-2">
    <div class="modify__choice d-flex flex-row-reverse">
      <div
        v-if="!isDisabled"
        class="btn btn-secondary me-1"
        style="width: 100px; height: 35px"
        @click="handleChangeModifyMode(true)"
      >
        Tắt sửa
      </div>
      <div
        v-if="isDisabled"
        class="btn btn-danger me-1"
        style="width: 100px; height: 35px"
        @click="handleChangeModifyMode(false)"
      >
        Sửa
      </div>
      <div
        v-if="!isDisabled"
        class="btn btn-success me-1"
        style="width: 100px"
        @click="handleUpdateInfo"
      >
        Lưu
      </div>
      <div
        v-if="updateResult && updateResult.status && !isDisabled"
        style="color: green; font-weight: bold; margin-right: 20px"
      >
        {{ updateResult.status == 200 ? 'Lưu thành công' : 'Lưu không thành công' }}!!!
      </div>
    </div>
    <form class="pe-4">
      <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
        <legend class="p-0 my-2 fs-5 fw-bolder">Thông tin đơn hàng</legend>
        <div class="col-5 p-0 border-0">
          <input
            type="file"
            id="fileInput"
            class="d-none"
            :disabled="isDisabled"
            @change="handleImageChange"
          />
          <label class="mb-4 d-flex justify-content-center" for="fileInput">
            <img
              :class="!isDisabled ? 'hoverOpacity' : ''"
              ref="imageOrder"
              :src="orderImg"
              alt="Click to upload"
              style="width: 300px"
            />
          </label>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="orderCode">Mã đơn hàng</label>
            <InputText id="orderCode" v-model="order.orderCode" :disabled="true" />
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="orderName">Tên đơn hàng</label>
            <InputText id="orderName" v-model="order.orderName" :disabled="isDisabled" />
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="companyName">Tên công ty</label>
            <InputText id="companyName" v-model="order.companyName" :disabled="isDisabled" />
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="companyAddress">Địa chỉ công ty</label>
            <InputText id="companyAddress" v-model="order.companyAddress" :disabled="isDisabled" />
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="jobDescription">Mô tả công việc</label>
            <Textarea id="jobDescription" v-model="order.jobDescription" :disabled="isDisabled" />
          </div>
        </div>
      </fieldset>
      <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
        <legend class="p-0 fs-5 mb-3 fw-bolder">Thông tin yêu cầu của đơn hàng</legend>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="ageRequire">Độ tuổi yêu cầu</label>
            <InputNumber
              id="ageRequire"
              class="mb-3"
              v-model="order.ageRequire"
              :disabled="isDisabled"
            />
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
              :disabled="isDisabled"
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
                :disabled="isDisabled"
                :pt="{ root: { class: 'flex-grow-1' } }"
              />
            </div>
            <div class="d-flex flex-row gap-1 mb-2 align-items-center">
              <label style="width: 40px" for="quantityRequireFemale">Nữ: </label>
              <InputNumber
                v-model="order.quantityRequire.female"
                id="quantityRequireFemale"
                :disabled="isDisabled"
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
                :disabled="isDisabled"
                :pt="{ root: { class: 'flex-grow-1' } }"
              />
            </div>
            <div class="d-flex flex-row gap-1 mb-2 align-items-center">
              <label style="width: 40px" for="heightRequireFemale">Nữ: </label>
              <InputNumber
                v-model="order.heightRequire.female"
                id="heightRequireFemale"
                :disabled="isDisabled"
                :pt="{ root: { class: 'flex-grow-1' } }"
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
                :disabled="isDisabled"
                :pt="{ root: { class: 'flex-grow-1' } }"
              />
            </div>
            <div class="d-flex flex-row gap-1 mb-2 align-items-center">
              <label style="width: 40px" for="weightRequireFemale">Nữ: </label>
              <InputNumber
                v-model="order.weightRequire.female"
                id="weightRequireFemale"
                :disabled="isDisabled"
                :pt="{ root: { class: 'flex-grow-1' } }"
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
                :disabled="isDisabled"
                :pt="{ root: { class: 'flex-grow-1' } }"
                suffix=" /10"
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
                :disabled="isDisabled"
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
              :disabled="true"
            />
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="timePosted">Thời gian đăng thông tin: </label>
            <div class="flex-auto">
              <Calendar
                v-model="order.timePosted"
                :disabled="true"
                :showOnFocus="false"
                inputId="timePosted"
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
            <label for="timeNeeded">Thời gian cần xuất khẩu: </label>
            <div class="flex-auto">
              <Calendar
                v-model="order.timeNeeded"
                :disabled="isDisabled"
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
              :disabled="isDisabled"
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
              :disabled="isDisabled"
            />
          </div>
        </div>
        <div class="col-5 p-0" v-if="employee">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="employee">Nhân viên quản lí đơn hàng: </label>
            <Textarea
              id="employee"
              class="mb-3"
              :value="`Tên: ${employee.person.name} \nNgày sinh: ${modifyDate(employee.person.birthDate)}`"
              :disabled="true"
            />
          </div>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<style scoped>
.hoverOpacity:hover {
  opacity: 0.6;
  cursor: pointer;
}
</style>
