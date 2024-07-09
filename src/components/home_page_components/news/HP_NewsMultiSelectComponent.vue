<script setup>
import MultiSelect from 'primevue/multiselect'
import { ref } from 'vue'
import modifyDate from '@/helpers/modifyDate'

// giá trị của select
const choices = defineModel('choices')

// giá trị của newses (tất cả các tin tức)
const options = defineModel('options')
const isUpdating = defineModel('isUpdating')

// các giá trị mà các lựa chọn sẽ không hiển thị vì nó của 2 loại hình tin tức khác
const exceptionChoices1 = defineModel('exceptionChoices1')
const exceptionChoices2 = defineModel('exceptionChoices2')

const props = defineProps(['placeholder', 'optionsLabel', 'selectionLimit', 'showOnHome'])
const optionsLabel = props.optionsLabel
const placeholder = props.placeholder
const selectionLimit = props.selectionLimit

// khởi tạo giá trị lựa chọn cho select bằng tất cả các tin tức loại bỏ đi 2 giá trị của 2 select còn lại
const multiChoices = ref(
  options.value.filter(
    (option) =>
      exceptionChoices1.value == null ||
      (!exceptionChoices1.value.includes(option) && !exceptionChoices2.value.includes(option))
  )
)

// mỗi khi có sự thay đổi lại cập nhật lại các lựa chọn có thể select nhận
const handleChange = () => {
  if (exceptionChoices1.value != null) {
    multiChoices.value = options.value.filter(
      (option) =>
        exceptionChoices1.value == null ||
        (!exceptionChoices1.value.includes(option) && !exceptionChoices2.value.includes(option))
    )
    isUpdating.value = true
  }
}
</script>

<template>
  <MultiSelect
    v-model="choices"
    :options="multiChoices"
    :optionLabel="optionsLabel"
    filter
    :placeholder="placeholder"
    display="chip"
    class="w-full md:w-80"
    :selectionLimit="selectionLimit"
    @change="handleChange"
  >
    <template #option="slotProps">
      <div class="flex items-center">
        <img
          v-if="slotProps.option.pictureBase64"
          :alt="slotProps.option[optionsLabel]"
          :src="slotProps.option.pictureBase64"
          style="width: 40px; height: 40px"
          class="rounded"
        />
        <div class="d-flex flex-column">
          {{ slotProps.option[optionsLabel] }}
          <span
            v-if="slotProps.option.timeOutstandingRelease"
            style="margin-top: 5px; font-size: 10px; color: #ccc"
            >{{ modifyDate(slotProps.option.timeOutstandingRelease) }}</span
          >
        </div>
      </div>
    </template>
    <template #footer>
      <div class="py-2 px-4">
        <b>{{ choices ? choices.length : 0 }}</b> Đã lựa chọn{{
          (choices ? choices.length : 0) > 1 ? 's' : ''
        }}
        tin tức.
      </div>
    </template>
  </MultiSelect>
</template>
