<!-- eslint-disable no-constant-condition -->
<script setup>
import { ref } from 'vue'
import { post } from '@/utils/httpRequest'
import { onMounted } from 'vue'
import { useStore } from 'vuex'

import Password from 'primevue/password'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import importImage from '@/helpers/importImage'
import md5Hash from '@/helpers/md5Hash'

const store = useStore()
const emit = defineEmits(['saveWorker'])
const props = defineProps(['worker'])
const worker = ref(props.worker)
const isDisabled = defineModel('isDisabled')

const updateResult = ref(null)
const initialWorkerPassword = props.worker.accountTraining.password

const imageWorker = ref(null)
let handleImageChange

const academyLevel = {
  cs: 'Cơ sở',
  pt: 'Phổ thông',
  cd: 'Cao đẳng',
  dh: 'Đại học'
}

// khởi tạo các giá trị hiển thị
worker.value.accountTraining.person.academicLevel = {
  text: academyLevel[worker.value.accountTraining.person.academicLevel],
  code: worker.value.accountTraining.person.academicLevel
}
worker.value.accountTraining.person.birthDate = new Date(
  worker.value.accountTraining.person.birthDate
)
worker.value.isMarried = {
  text: worker.value.isMarried ? 'Đã kết hôn' : 'Chưa kết hôn',
  state: worker.value.isMarried
}
worker.value.accountTraining.password = ''
const accountImg = importImage('user', props.worker.accountTraining.person.photo)

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
    worker.value.accountTraining.person.anotherCertificates[index] = newData
  }
}

const onRowEditInitAnotherCertificate = (event) => {
  let { index } = event
  if (isDisabled.value == false) {
    rowIndexEditAnotherCertificate.value.push(index)
  }
}

const onRowEditCancelAnotherCertificate = (event) => {
  let { index } = event

  const indexDelete = rowIndexEditAnotherCertificate.value.indexOf(index)
  rowIndexEditAnotherCertificate.value.splice(indexDelete, 1)
}

// gửi dữ liệu update
const handleUpdateInfo = async () => {
  while (true) {
    const indexDelete = worker.value.accountTraining.person.anotherCertificates.findIndex(
      (c) => c.certificateName === '' && c.level === ''
    )
    if (indexDelete == -1) {
      break
    } else {
      worker.value.accountTraining.person.anotherCertificates.splice(indexDelete, 1)
    }
  }
  try {
    updateResult.value = await post(`/working/worker/${worker.value._id}/update`, {
      worker: {
        ...worker.value,
        isMarried: worker.value.isMarried.state,
        accountTraining: {
          ...worker.value.accountTraining,
          password:
            worker.value.accountTraining.password == ''
              ? initialWorkerPassword
              : md5Hash(worker.value.accountTraining.password),
          person: {
            ...worker.value.accountTraining.person,
            birthDate: worker.value.accountTraining.person.birthDate.toISOString(),
            academicLevel: worker.value.accountTraining.person.academicLevel.code
          }
        }
      }
    })
    store.commit('changeDataNeeded', {
      ...store.state.dataNeeded,
      worker_list: updateResult.value.data
    })
  } catch (e) {
    updateResult.value = e
  }
  emit('saveWorker', worker.value._id, 0)
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
      worker.value.accountTraining.person.photoType = fileInput.files[0].name.split('.')[1]

      reader.onload = function (e) {
        imageWorker.value.src = e.target.result
        worker.value.accountTraining.person.photo = e.target.result
      }

      reader.readAsDataURL(fileInput.files[0])
    }
  }
})
</script>

<template>
  <div class="worker__info ms-2">
    <div class="modify__choice d-flex flex-row-reverse">
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
            <label for="floatingAccountCode">Tên người dùng tài khoản</label>
            <InputText
              id="floatingAccountCode"
              v-model="worker.accountTraining.accountCode"
              :disabled="isDisabled"
            />
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="floatingAccountPassword">Mật khẩu</label>
            <Password
              id="floatingAccountPassword"
              v-model="worker.accountTraining.password"
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
              ref="imageWorker"
              :src="accountImg"
              alt="Click to upload"
              style="width: 300px"
            />
          </label>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="floatingAccountName">Tên lao động</label>
            <InputText
              id="floatingAccountName"
              class="mb-3"
              v-model="worker.accountTraining.person.name"
              :disabled="isDisabled"
            />
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="floatingAccountMarried">Tình trạng hôn nhân</label>
            <Dropdown
              v-model="worker.isMarried"
              :options="[
                { text: 'Đã kết hôn', state: true },
                { text: 'Chưa kết hôn', state: false }
              ]"
              optionLabel="text"
              input-id="floatingAccountMarried"
              checkmark
              :highlightOnSelect="false"
              class="w-full md:w-14rem"
              :disabled="isDisabled"
            />
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="floatingAccountIdentifyCard">Căn cước công dân/Chứng minh thư</label>
            <InputText
              v-model="worker.accountTraining.person.identifyCard"
              id="floatingAccountIdentifyCard"
              :disabled="isDisabled"
            />
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="floatingAccountBirthDate">Ngày sinh</label>
            <div class="flex-auto">
              <Calendar
                v-model="worker.accountTraining.person.birthDate"
                :disabled="isDisabled"
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
            <InputText
              v-model="worker.accountTraining.person.phoneNumber"
              id="floatingAccountPhoneNumber"
              :disabled="isDisabled"
            />
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="floatingAccountAddress">Địa chỉ</label>
            <InputText
              v-model="worker.accountTraining.person.address"
              id="floatingAccountAddress"
              :disabled="isDisabled"
            />
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1 mb-3">
            <label for="floatingAccountAcademicLevel">Trình độ bằng cấp</label>
            <Dropdown
              v-model="worker.accountTraining.person.academicLevel"
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
              :disabled="isDisabled"
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
              v-model="worker.accountTraining.person.associateContact.name"
              id="floatingAssociationContactName"
              :disabled="isDisabled"
              :pt="{ root: { class: 'flex-grow-1' } }"
            />
          </div>
          <div class="d-flex flex-row gap-1 mb-2 align-items-center">
            <label style="width: 130px" for="floatingAssociationContactRelation"
              >Mối quan hệ:
            </label>
            <InputText
              v-model="worker.accountTraining.person.associateContact.relation"
              id="floatingAssociationContactRelation"
              :disabled="isDisabled"
              :pt="{ root: { class: 'flex-grow-1' } }"
            />
          </div>
          <div class="d-flex flex-row gap-1 mb-2 align-items-center">
            <label style="width: 130px" for="floatingAssociationContactPhoneNumber"
              >Số điện thoại:
            </label>
            <InputText
              v-model="worker.accountTraining.person.associateContact.phoneNumber"
              id="floatingAssociationContactPhoneNumber"
              :disabled="isDisabled"
              :pt="{ root: { class: 'flex-grow-1' } }"
            />
          </div>
        </div>
        <div class="col-5 p-0">
          <div class="d-flex flex-column gap-1">
            <label class="mb-2" for="">Bằng cấp/ Chứng chỉ khác</label>
            <DataTable
              v-model:editingRows="editingRowsAnotherCertificate"
              :value="worker.accountTraining.person.anotherCertificates"
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
                          const indexToRemove =
                            worker.accountTraining.person.anotherCertificates.findIndex(
                              (item) => item == data
                            )
                          if (indexToRemove !== -1) {
                            worker.accountTraining.person.anotherCertificates.splice(
                              indexToRemove,
                              1
                            )
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
                  worker.accountTraining.person.anotherCertificates.push({
                    certificateName: '',
                    level: ''
                  })
                  rowIndexEditAnotherCertificate.push(
                    worker.accountTraining.person.anotherCertificates.length - 1
                  )
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
