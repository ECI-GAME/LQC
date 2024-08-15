<script setup lang="ts">
import {Spin} from "ant-design-vue";

defineProps({
  status: {
    type: Boolean,
    default: () => false
  }
});
</script>

<template>
  <div class="relative">
    <slot></slot>
    <div v-if="status"
         class="absolute left-0 top-0 right-0 bottom-0 ease-in-out flex items-center justify-center">
      <Spin size="large"></Spin>
    </div>
  </div>
</template>
