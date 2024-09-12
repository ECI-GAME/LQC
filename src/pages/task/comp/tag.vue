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
  <div class="clearfix block">
    <div class="-ml-2 -mt-2">
      <div class="ml-2 mt-2 inline-block" v-for="name in list(value)" :key="name">
        <Tag class="m-0" v-if="name" color="blue">{{ name }}</Tag>
      </div>
    </div>
  </div>
</template>
