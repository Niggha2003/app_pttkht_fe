<!-- eslint-disable no-constant-condition -->
<script setup>
import { ref } from 'vue'
import { post } from '@/utils/httpRequest'
import { onMounted } from 'vue'
import getHighestCode from '@/helpers/getHighestCode'

import Password from 'primevue/password'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'

const addResult = ref(null)
const addResultVisible = ref(false)

const account = ref({
  accountCode: null,
  password: null,
  role: { text: 'Admin', role: 'admin' },
  person: {
    name: null,
    birthDate: new Date(),
    phoneNumber: null,
    academicLevel: { text: 'Đại học', code: 'dh' },
    anotherCertificates: [],
    address: null,
    associateContact: {
      name: null,
      relation: null,
      phoneNumber: null
    },
    identifyCard: null
  }
})
const imageAccount = ref(null)
let handleImageChange

// Giá trị cho datatable edit row nhất định chỉ được chỉnh sửa
const editingRowsAnotherCertificate = ref([])
const rowIndexEditAnotherCertificate = ref([])

// xử lí edit row bảng chứng chỉ
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

const onRowEditInitAnotherCertificate = (event) => {
  let { index } = event
  rowIndexEditAnotherCertificate.value.push(index)
}

const onRowEditCancelAnotherCertificate = (event) => {
  let { index } = event

  const indexDelete = rowIndexEditAnotherCertificate.value.indexOf(index)
  rowIndexEditAnotherCertificate.value.splice(indexDelete, 1)
}

const handleAddAccount = async () => {
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
    addResult.value = await post(`/account/account_employee/create`, {
      accountEmployee: {
        ...account.value,
        role: account.value.role.role,
        person: {
          ...account.value.person,
          birthDate: account.value.person.birthDate.toISOString(),
          academicLevel: account.value.person.academicLevel.code
        }
      }
    })
    addResultVisible.value = true
  } catch (e) {
    addResult.value = e
    addResultVisible.value = true
  }
}

const resetAddAccount = async () => {
  // reset kết quả thêm
  addResult.value = null

  // reset giá trị tài khoản
  account.value = {
    accountCode: await getHighestCode('/account/account_employee', 'account'),
    password: null,
    role: { text: 'Admin', role: 'admin' },
    person: {
      name: null,
      birthDate: new Date(),
      phoneNumber: null,
      academicLevel: { text: 'Đại học', code: 'dh' },
      anotherCertificates: [],
      address: null,
      associateContact: {
        name: null,
        relation: null,
        phoneNumber: null
      },
      identifyCard: null,
      photo: null,
      photoType: null
    }
  }

  // reset ảnh
  imageAccount.value = null
}

// thay đổi hình ảnh
onMounted(() => {
  resetAddAccount()
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
</script>

<template>
  <div class="card p-4 mb-6">
    <div class="account__info ms-5">
      <Dialog
        v-if="addResult"
        v-model:visible="addResultVisible"
        modal
        header="Kết quả thêm mới tài khoản"
        :style="{
          width: '25rem',
          'font-weight': 'bold',
          'text-align': 'center'
        }"
      >
        <div :style="{ color: addResult.status === 200 ? 'green' : 'red' }">
          {{
            addResult.status === 200
              ? 'Thêm thành công'
              : addResult.response.status === 409
                ? 'Mã đăng nhập đã tồn tại'
                : 'Cần nhập đầy đủ trường thông tin'
          }}!!!
        </div>
      </Dialog>
      <div
        v-if="!(addResult && addResult.status && addResult.status == 200)"
        class="modify__choice d-flex flex-row-reverse"
      >
        <div class="btn btn-success me-1" style="width: 100px" @click="handleAddAccount">Thêm</div>
      </div>
      <form v-if="!(addResult && addResult.status && addResult.status == 200)" class="pe-4">
        <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
          <legend class="p-0 fs-5 fw-bolder">Thông tin tài khoản</legend>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="floatingAccountCode">Tên người dùng tài khoản</label>
              <InputText id="floatingAccountCode" v-model="account.accountCode" disabled />
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="floatingAccountPassword">Mật khẩu</label>
              <Password
                id="floatingAccountPassword"
                v-model="account.password"
                toggleMask
                :input-style="{ width: '100%' }"
              />
            </div>
          </div>
        </fieldset>
        <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
          <legend class="p-0 fs-5 mb-3 fw-bolder">Thông tin cá nhân</legend>
          <div class="col-5 p-0 border-0">
            <input type="file" id="fileInput" class="d-none" @change="handleImageChange" />
            <label class="mb-4 d-flex justify-content-center" for="fileInput">
              <img
                class="hoverOpacity"
                ref="imageAccount"
                alt="Click to upload"
                style="width: 300px"
              />
            </label>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="floatingAccountName">Tên nhân viên</label>
              <InputText id="floatingAccountName" class="mb-3" v-model="account.person.name" />
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="floatingAccountRole">Chức vụ</label>
              <Dropdown
                v-model="account.role"
                :options="[
                  { text: 'Quản lí lao động', role: 'working' },
                  { text: 'Quản lí đơn hàng', role: 'ordering' },
                  { text: 'Quản lí đơn đăng kí', role: 'signing' },
                  { text: 'Admin', role: 'admin' }
                ]"
                optionLabel="text"
                input-id="floatingAccountRole"
                checkmark
                :highlightOnSelect="false"
                class="w-full md:w-14rem"
              />
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="floatingAccountIdentifyCard">Căn cước công dân/Chứng minh thư</label>
              <InputText v-model="account.person.identifyCard" id="floatingAccountIdentifyCard" />
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="floatingAccountBirthDate">Ngày sinh</label>
              <div class="flex-auto">
                <Calendar
                  v-model="account.person.birthDate"
                  showIcon
                  :showOnFocus="false"
                  inputId="floatingAccountBirthDate"
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
              <label for="floatingAccountPhoneNumber">Số điện thoại</label>
              <InputText v-model="account.person.phoneNumber" id="floatingAccountPhoneNumber" />
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="floatingAccountAddress">Địa chỉ</label>
              <InputText v-model="account.person.address" id="floatingAccountAddress" />
            </div>
          </div>
          <div class="col-5 p-0">
            <div class="d-flex flex-column gap-1 mb-3">
              <label for="floatingAccountAcademicLevel">Trình độ bằng cấp</label>
              <Dropdown
                v-model="account.person.academicLevel"
                :options="[
                  { text: 'Cơ sở', code: 'cs' },
                  { text: 'Phổ thông', code: 'pt' },
                  { text: 'Cao đẳng', code: 'cd' },
                  { text: 'Đại học', code: 'dh' }
                ]"
                optionLabel="text"
                input-id="floatingAccountAcademicLevel"
                checkmark
                :highlightOnSelect="false"
                class="w-full md:w-14rem"
              />
            </div>
          </div>
        </fieldset>
        <fieldset class="row d-flex border-bottom justify-content-between my-2 pb-2">
          <legend class="p-0 fs-5 mb-3 fw-bolder">Thông tin khác</legend>
          <div class="col-5 p-0">
            <label for="" class="mb-3">Người liên hệ</label>
            <div class="d-flex flex-row gap-1 mb-2 align-items-center">
              <label style="width: 130px" for="floatingAssociationContactName">Tên: </label>
              <InputText
                v-model="account.person.associateContact.name"
                id="floatingAssociationContactName"
                :pt="{ root: { class: 'flex-grow-1' } }"
              />
            </div>
            <div class="d-flex flex-row gap-1 mb-2 align-items-center">
              <label style="width: 130px" for="floatingAssociationContactRelation"
                >Mối quan hệ:
              </label>
              <InputText
                v-model="account.person.associateContact.relation"
                id="floatingAssociationContactRelation"
                :pt="{ root: { class: 'flex-grow-1' } }"
              />
            </div>
            <div class="d-flex flex-row gap-1 mb-2 align-items-center">
              <label style="width: 130px" for="floatingAssociationContactPhoneNumber"
                >Số điện thoại:
              </label>
              <InputText
                v-model="account.person.associateContact.phoneNumber"
                id="floatingAssociationContactPhoneNumber"
                :pt="{ root: { class: 'flex-grow-1' } }"
              />
            </div>
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
                      state.d_editing = rowIndexEditAnotherCertificate.includes(instance.rowIndex)
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
                    rowIndexEditAnotherCertificate.push(
                      account.person.anotherCertificates.length - 1
                    )
                  }
                "
              />
            </div>
          </div>
        </fieldset>
      </form>
      <div
        v-if="addResult && addResult.status && addResult.status == 200"
        class="d-flex justify-content-center py-2"
      >
        <Button
          label="Tiếp tục thêm mới tài khoản"
          severity="secondary"
          icon="pi pi-user-plus"
          iconPos="right"
          @click="resetAddAccount()"
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
