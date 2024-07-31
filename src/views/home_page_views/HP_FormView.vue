<script setup>
import HP_HeaderComponent from '@/components/home_page_components/HP_HeaderComponent.vue'
import HP_FooterComponent from '@/components/home_page_components/HP_FooterComponent.vue'
import { ref } from 'vue'
import { get, post } from '@/utils/httpRequest'

const props = defineProps(['orderCode'])
const orderCode = props.orderCode
const information = ref({
  name: null,
  phoneNumber: null,
  email: null,
  birthDate: null,
  orderCode: orderCode ? orderCode : null
})
const infoCompany = ref(null)
const result = ref(null)
const isResultDialogShow = ref(false)

const getInfoCompany = async () => {
  const info = await get('/info')
  infoCompany.value = [
    {
      icon: 'pi pi-map-marker',
      text: info ? info.text : '',
      type: 'location',
      color: 'pink'
    },
    {
      icon: 'pi pi-phone',
      text: info ? info.phoneNumber : '',
      type: 'phone number',
      color: 'yellow'
    },
    {
      icon: 'pi pi-envelope',
      text: info ? info.email : '',
      type: 'email',
      color: 'blue'
    },
    {
      icon: 'pi pi-globe',
      text: info ? info.website : '',
      type: 'website',
      color: 'green'
    }
  ]
}

const handleSendInfo = async () => {
  if (
    information.value.name == null &&
    information.value.phoneNumber == null &&
    information.value.email == null &&
    information.value.birthDate == null &&
    information.value.orderCode == null
  ) {
    result.value = { status: 400 }
  } else {
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(information.value.email) ||
      !/^[\d\s]+$/.test(information.value.phoneNumber)
    ) {
      result.value = { status: 403 }
    } else {
      const order = await get('/order/order', { orderCode: information.value.orderCode })
      if (order.length == 0) {
        result.value = { status: 404 }
      } else {
        information.value.order = order[0]._id
        result.value = await post('/signing/apply/create', { apply: information.value })
      }
    }
  }
  isResultDialogShow.value = true
}

const handleSetBackInfo = () => {
  information.value.name = null
  information.value.phoneNumber = null
  information.value.email = null
  information.value.birthDate = null
  information.value.orderCode = orderCode ? orderCode : null
}

Promise.all([getInfoCompany()])
</script>

<template>
  <HP_HeaderComponent :activeIndex="4"></HP_HeaderComponent>
  <div class="form__content card container p-0 pb-6 my-7">
    <h3
      style="width: 100%; height: 60px; background-color: #89d286"
      class="mb-6 fw-bolder text-white d-flex align-items-center justify-content-center"
    >
      Hãy ứng tuyển đơn hàng bạn muốn với chúng tôi!!!
    </h3>
    <div class="px-4">
      <div class="flex items-center gap-4 mb-6">
        <label for="informationName" class="font-semibold w-24">Họ và tên *:</label>
        <InputText
          v-model="information.name"
          id="informationName"
          class="flex-auto"
          autocomplete="off"
          :invalid="information.name == null"
        />
      </div>
      <div class="flex items-center gap-4 mb-6">
        <label for="informationBirthDate" class="font-semibold w-24">Ngày sinh *:</label>
        <Calendar
          v-model="information.birthDate"
          showIcon
          :showOnFocus="false"
          inputId="informationBirthDate"
          dateFormat="dd/mm/yy"
          :invalid="information.birthDate == null"
        />
      </div>
      <div class="flex items-center gap-4 mb-6">
        <label for="informationPhoneNumber" class="font-semibold w-24">Điện thoại *:</label>
        <InputText
          v-model="information.phoneNumber"
          id="informationPhoneNumber"
          class="flex-auto"
          autocomplete="off"
          :invalid="information.phoneNumber == null"
        />
      </div>
      <div class="flex items-center gap-4 mb-6">
        <label for="informationEmail" class="font-semibold w-24">Email *:</label>
        <InputText
          v-model="information.email"
          id="informationEmail"
          class="flex-auto"
          autocomplete="off"
          :invalid="information.email == null"
        />
      </div>
      <div class="flex items-center gap-4 mb-6">
        <label for="informationOrderCode" class="font-semibold w-24"
          >Mã đơn hàng muốn ứng tuyển *:</label
        >
        <InputText
          v-model="information.orderCode"
          id="finalText"
          class="flex-auto"
          autocomplete="off"
          :invalid="information.orderCode == null"
        />
      </div>
      <div class="mt-6 d-flex justify-content-end gap-2">
        <Button
          type="button"
          label="Đặt lại thông tin"
          severity="secondary"
          @click="handleSetBackInfo"
          class="rounded"
        ></Button>
        <Button
          type="button"
          label="Gửi thông tin"
          @click="handleSendInfo"
          class="rounded ms-4"
        ></Button>
      </div>
    </div>
    <h3
      style="width: 100%; height: 60px; background-color: #89d286"
      class="my-6 fw-bolder text-white d-flex align-items-center justify-content-center"
    >
      Hoặc:
    </h3>
    <div class="px-4">
      <div class="d-inline-block fs-4 mb-4 p-2" style="border-bottom: solid 1px #89d286">
        Liên hệ trực tiếp tại:
      </div>
      <div v-for="info in infoCompany" :key="info" class="d-flex py-1 my-1 align-items-center">
        <span
          :class="info.icon + ' me-3'"
          :style="{
            color: info.color,
            'text-shadow': '2px 2px 1px rgba(0, 0, 0, .2)'
          }"
        ></span>
        <span>{{ info.text }}</span>
      </div>
    </div>
  </div>
  <Dialog
    v-model:visible="isResultDialogShow"
    modal
    header="Kết quả đăng kí ứng tuyển"
    :style="{ width: '30rem' }"
    @hide="result = null"
  >
    <div class="d-flex justify-content-center">
      <div
        :class="`fw-bolder ${result && result.status && result.status == 200 ? 'text-success' : 'text-danger'} `"
      >
        <div>
          {{
            result && result.status && result.status == 200
              ? ' Ứng tuyển thành công vui lòng quý khách đợi liên lạc từ chúng tôi trong thời gian tới!!'
              : result && result.status && result.status == 400
                ? 'Mời nhập đầy đủ trường thông tin!!!'
                : result && result.status && result.status == 404
                  ? 'Mã đơn hàng không hợp lệ!!!'
                  : `Email không hợp lệ hoặc số điện thoại không hợp lệ`
          }}
        </div>
        <div>Trân trọng!!</div>
      </div>
    </div>
  </Dialog>
  <HP_FooterComponent></HP_FooterComponent>
</template>
