<script setup lang="ts">
import {Tag} from "ant-design-vue";

defineProps({
  value: {
    type: String,
    required: false,
  },
});

const list = function (text?: string): string[] {
  if (text) {
    const tmp = text.trim();
    return tmp.split(';');
  }
  return [];
}

</script>

<template>
  <div>
    <template v-for="name in list(value)" :key="name">
      <Tag v-if="name" color="blue">{{ name }}</Tag>
    </template>
  </div>
</template>
