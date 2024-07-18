<!-- eslint-disable no-constant-condition -->
<script setup>
import { ref } from 'vue'
import { post } from '@/utils/httpRequest'
import { onMounted } from 'vue'

import Password from 'primevue/password'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import importImage from '@/helpers/importImage'
import md5Hash from '@/helpers/md5Hash'

import FormCoverComponent from '../content_components/FormCoverComponent.vue'

const props = defineProps(['account'])
const account = ref(props.account)
const isDisabled = ref(true)

const updateResult = ref(null)
const initialAccountPassword = account.value.password

const imageAccount = ref(null)
let handleImageChange

const academyLevel = {
  cs: 'Cơ sở',
  pt: 'Phổ thông',
  cd: 'Cao đẳng',
  dh: 'Đại học'
}

// khởi tạo các giá trị hiển thị
account.value.person.academicLevel = {
  text: academyLevel[account.value.person.academicLevel],
  code: account.value.person.academicLevel
}

account.value.person.birthDate = new Date(account.value.person.birthDate)
account.value.password = ''
const accountImg = importImage('user', account.value.person.photo)

// Giá trị cho datatable edit row đang được chỉnh sửa
const editingRowsAnotherCertificate = ref([])

// Đây là những chỉ số row mà đang ở trạng thái edit
const rowIndexEditAnotherCertificate = ref([])

// xử lí edit row bảng chứng chỉ (khi save lại thì row đó không đang sửa nữa và sẽ lưu data lại nếu hợp lệ)
const onRowEditSaveAnotherCertificate = (event) => {
  let { newData, index } = event
  const indexDelete = rowIndexEditAnotherCertificate.value.indexOf(index)
  rowIndexEditAnotherCertificate.value.splice(indexDelete, 1)
  if (newData.certificateName == '' || newData.level == '') {
    return
  } else {
    account.value.person.anotherCertificates[index] = newData
  }
}

// add chỉ số vào mảng các index đang chỉnh sửa
const onRowEditInitAnotherCertificate = (event) => {
  let { index } = event
  if (isDisabled.value == false) {
    rowIndexEditAnotherCertificate.value.push(index)
  }
}

// hủy thì chỉ cần xóa index ra khỏi mảng các index đang chỉnh sửa
const onRowEditCancelAnotherCertificate = (event) => {
  let { index } = event

  const indexDelete = rowIndexEditAnotherCertificate.value.indexOf(index)
  rowIndexEditAnotherCertificate.value.splice(indexDelete, 1)
}

// gửi dữ liệu update
const handleUpdateInfo = async () => {
  while (true) {
    const indexDelete = account.value.person.anotherCertificates.findIndex(
      (c) => c.certificateName === '' && c.level === ''
    )
    if (indexDelete == -1) {
      break
    } else {
      account.value.person.anotherCertificates.splice(indexDelete, 1)
    }
  }
  try {
    updateResult.value = await post(`/account/account_employee/${account.value._id}/update`, {
      accountEmployee: {
        ...account.value,
        password:
          account.value.password == '' ? initialAccountPassword : md5Hash(account.value.password),
        person: {
          ...account.value.person,
          birthDate: account.value.person.birthDate.toISOString(),
          academicLevel: account.value.person.academicLevel.code
        }
      }
    })
  } catch (e) {
    updateResult.value = e
  }
  setTimeout(() => {
    updateResult.value = null
  }, 1000)
}

// thay đổi hình ảnh
onMounted(() => {
  handleImageChange = (e) => {
    const fileInput = e.target

    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader()
      account.value.person.photoType = fileInput.files[0].name.split('.')[1]

      reader.onload = function (e) {
        imageAccount.value.src = e.target.result
        account.value.person.photo = e.target.result
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
        <legend class="p-0 fs-5 fw-bolder">Thông tin tài khoản</legend>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="AccountCode">Tên người dùng tài khoản</label>
            <InputText id="AccountCode" v-model="account.accountCode" :disabled="true" />
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="AccountPassword">Mật khẩu</label>
            <Password
              id="AccountPassword"
              v-model="account.password"
              toggleMask
              :disabled="isDisabled"
              :input-style="{ width: '100%' }"
            />
          </div>
        </div>
      </fieldset>
      <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
        <legend class="p-0 fs-5 mb-3 fw-bolder">Thông tin cá nhân</legend>
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
              ref="imageAccount"
              :src="accountImg"
              alt="Click to upload"
              style="width: 300px"
            />
          </label>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="AccountName">Tên nhân viên</label>
            <InputText
              id="AccountName"
              class="mb-3"
              v-model="account.person.name"
              :disabled="isDisabled"
            />
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="AccountIdentifyCard">Căn cước công dân/Chứng minh thư</label>
            <InputText
              v-model="account.person.identifyCard"
              id="AccountIdentifyCard"
              :disabled="isDisabled"
            />
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="AccountBirthDate">Ngày sinh</label>
            <div class="flex-auto">
              <Calendar
                v-model="account.person.birthDate"
                :disabled="isDisabled"
                showIcon
                :showOnFocus="false"
                inputId="AccountBirthDate"
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
            <label for="AccountPhoneNumber">Số điện thoại</label>
            <InputText
              v-model="account.person.phoneNumber"
              id="AccountPhoneNumber"
              :disabled="isDisabled"
            />
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="AccountAddress">Địa chỉ</label>
            <InputText
              v-model="account.person.address"
              id="AccountAddress"
              :disabled="isDisabled"
            />
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="AccountAcademicLevel">Trình độ bằng cấp</label>
            <Dropdown
              v-model="account.person.academicLevel"
              :options="[
                { text: 'Cơ sở', code: 'cs' },
                { text: 'Phổ thông', code: 'pt' },
                { text: 'Cao đẳng', code: 'cd' },
                { text: 'Đại học', code: 'dh' }
              ]"
              optionLabel="text"
              input-id="AccountAcademicLevel"
              checkmark
              :highlightOnSelect="false"
              class="w-full"
              :disabled="isDisabled"
            />
          </div>
        </div>
      </fieldset>
      <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
        <legend class="p-0 fs-5 mb-3 fw-bolder">Thông tin khác</legend>
        <div class="col-5 p-0 my-4">
          <FormCoverComponent title="Người liên hệ">
            <div class="d-flex flex-row gap-1 mb-2 align-items-center">
              <label style="width: 130px" for="AssociationContactName">Tên: </label>
              <InputText
                v-model="account.person.associateContact.name"
                id="AssociationContactName"
                :disabled="isDisabled"
                :pt="{ root: { class: 'flex-grow-1' } }"
              />
            </div>
            <div class="d-flex flex-row gap-1 mb-2 align-items-center">
              <label style="width: 130px" for="AssociationContactRelation">Mối quan hệ: </label>
              <InputText
                v-model="account.person.associateContact.relation"
                id="AssociationContactRelation"
                :disabled="isDisabled"
                :pt="{ root: { class: 'flex-grow-1' } }"
              />
            </div>
            <div class="d-flex flex-row gap-1 mb-2 align-items-center">
              <label style="width: 130px" for="AssociationContactPhoneNumber"
                >Số điện thoại:
              </label>
              <InputText
                v-model="account.person.associateContact.phoneNumber"
                id="AssociationContactPhoneNumber"
                :disabled="isDisabled"
                :pt="{ root: { class: 'flex-grow-1' } }"
              />
            </div>
          </FormCoverComponent>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1">
            <label class="mb-2" for="">Bằng cấp/ Chứng chỉ khác</label>
            <DataTable
              v-model:editingRows="editingRowsAnotherCertificate"
              :value="account.person.anotherCertificates"
              editMode="row"
              dataKey="id"
              @row-edit-save="onRowEditSaveAnotherCertificate"
              @row-edit-init="onRowEditInitAnotherCertificate"
              @row-edit-cancel="onRowEditCancelAnotherCertificate"
              showGridlines
              :pt="{
                table: { style: 'width: 100%' },
                column: {
                  bodycell: ({ state, instance }) => {
                    state.d_editing =
                      rowIndexEditAnotherCertificate.includes(instance.rowIndex) && !isDisabled
                    return { class: { border: true } }
                  }
                }
              }"
            >
              <Column
                v-for="col of [
                  { field: 'certificateName', header: 'Tên chứng chỉ' },
                  { field: 'level', header: 'Cấp độ' },
                  { field: 'delete', header: 'Xóa' }
                ]"
                :key="col.field"
                :field="col.field"
                :header="col.header"
                :style="
                  col.field == 'delete'
                    ? 'width: 10%'
                    : col.field == 'level'
                      ? 'width: 20%'
                      : 'width: 60%'
                "
                :pt="{ headerCell: { class: 'border' } }"
              >
                <template #body="{ data, field }">
                  <template v-if="field == 'delete'">
                    <Button
                      icon="pi pi-times"
                      severity="danger"
                      aria-label="Cancel"
                      rounded
                      outlined
                      :disabled="isDisabled"
                      :pt="{
                        root: {
                          class: 'rounded'
                        }
                      }"
                      @click="
                        () => {
                          const indexToRemove = account.person.anotherCertificates.findIndex(
                            (item) => item == data
                          )
                          if (indexToRemove !== -1) {
                            account.person.anotherCertificates.splice(indexToRemove, 1)
                          }
                        }
                      "
                    />
                  </template>
                  <template v-else>
                    {{ data[field] }}
                  </template>
                </template>
                <template #editor="{ data, field }">
                  <template v-if="field == 'delete'"> </template>
                  <template v-else>
                    <InputText v-model="data[field]" :pt="{ root: { style: 'width: 100%' } }" />
                  </template>
                </template>
              </Column>
              <Column
                :rowEditor="true"
                style="width: 10%"
                bodyStyle="text-align:center"
                :pt="{
                  headerCell: { class: 'border' }
                }"
              ></Column>
            </DataTable>
            <Button
              label="Thêm"
              :disabled="isDisabled"
              :pt="{
                root: {
                  class: 'rounded mt-3',
                  style: { width: '100px', height: '30px', 'align-self': 'end' }
                }
              }"
              @click="
                () => {
                  account.person.anotherCertificates.push({
                    certificateName: '',
                    level: ''
                  })
                  rowIndexEditAnotherCertificate.push(account.person.anotherCertificates.length - 1)
                }
              "
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
