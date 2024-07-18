<script setup>
const props = defineProps(['title'])
const title = props.title
</script>

<template>
  <div class="position-relative p-3 pt-5 border-1" style="border-color: #ccc; border-radius: 20px">
    <span
      class="position-absolute"
      style="
        background-color: white;
        top: 0;
        left: 10%;
        transform: translateY(-50%);
        padding: 0 10px;
      "
    >
      {{ title }}
    </span>
    <slot></slot>
  </div>
</template>
