<script setup>
import importImage from '@/helpers/importImage'
import modifyDate from '@/helpers/modifyDate'

import getValueByMultipleKey from '@/helpers/getValueByMultipleKey'
import { ref } from 'vue'

const filters = defineModel('filters')
const emit = defineEmits(['clearFilter'])
const props = defineProps(['items', 'globalFilterFields', 'columns', 'tableFor', 'type'])

const items = ref(props.items)
const globalFilterFields = props.globalFilterFields
const tableFor = props.tableFor

// 1 column  có thể có các thuộc tính:
// header: "", width: "", type: "", param: "",icon, severity buttonFunction: function() {}
// Trong đó:
// - param là chỉ mục tham chiếu của object ví dụ (person.name)
// - type có thể bằng text, date, image, button, tag
// - nếu có button sẽ có thêm buttonFunction, icon, severity, label, iconPos
// - nếu có tag sẽ có thêm icon, severity, iconPos
// - type bằng image thì có thêm urlFolder là đường dẫn của folder chứa hình ảnh đó trong server
const columns = props.columns

// type có thể là info, hoặc là black
const type = props.type
</script>

<template>
  <DataTable
    v-model:filters="filters"
    :value="items"
    paginator
    :rows="5"
    dataKey="id"
    filterDisplay="menu"
    :globalFilterFields="globalFilterFields"
    :pt="{
      column: {
        bodycell: {
          class: { 'border-2': true },
          style: { 'text-align': 'center', 'border-color': '#ccc' }
        }
      }
    }"
  >
    <template #header>
      <div class="flex justify-content-between mb-2">
        <Button
          type="button"
          :severity="type == 'info' ? 'info' : 'contrast'"
          icon="pi pi-filter-slash"
          label="Clear"
          outlined
          @click="
            () => {
              emit('clearFilter')
            }
          "
          :pt="{
            root: { class: 'border-3' }
          }"
        />
        <IconField iconPosition="left">
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText
            class="custom-input"
            v-model="filters['global'].value"
            placeholder="Keyword Search"
          />
        </IconField>
      </div>
    </template>
    <template #empty> Không tìm thấy {{ tableFor }} nào. </template>
    <Column
      v-for="column in columns"
      :key="column"
      :header="column.header"
      :style="`width: ${column.width}`"
      :dataType="column.type == 'date' ? 'date' : null"
      :pt="{
        headerCell: {
          class: 'border-3',
          style: `border-color: #ccc; background-color: ${type == 'info' ? 'rgb(230, 234, 243);' : '#595959; color: white'}`
        },
        filterMenuButton: {
          ...(type == 'black' && { class: 'hoverToBlack', style: 'color: white' })
        }
      }"
    >
      <template #body="{ data }">
        <img
          v-if="column.type == 'image'"
          :src="importImage(column.urlFolder, getValueByMultipleKey(data, column.param))"
          style="width: 100px; height: 100px"
        />

        <span v-if="column.type == 'text'"> {{ getValueByMultipleKey(data, column.param) }}</span>

        <span v-if="column.type == 'date'">
          {{ modifyDate(getValueByMultipleKey(data, column.param).toISOString()) }}</span
        >

        <Button
          v-if="column.type == 'button'"
          :label="column.label"
          :icon="column.icon"
          :iconPos="column.iconPos"
          :severity="column.severity"
          @click="column.buttonFunction(data)"
          style="border-radius: 50px; font-size: 10px"
        />

        <Tag
          v-if="column.type == 'tag'"
          :value="getValueByMultipleKey(data, column.param)"
          :icon="column.icon"
          :severity="getValueByMultipleKey(data, column.severity)"
          :iconPos="column.iconPos"
        ></Tag>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
.custom-input:focus {
  outline: none; /* Tùy chọn: Bỏ viền outline mặc định khi focus */
}
</style>

<style>
.hoverToBlack:hover {
  color: black !important;
}
</style>
