<script setup lang="ts">
import {Descriptions, DescriptionsItem} from "ant-design-vue";

defineProps({
  word: {
    type: Object,
    default: function () {
      return {};
    }
  }
})

</script>

<template>
  <Descriptions class="mb-5 deep-[th]:hidden" :column="1" :bordered="true" size="small">
    <template v-for="(name, value) in word" :key="name">
      <DescriptionsItem>
        <span class="mr-3">{{ name }}:</span>
        <span>{{ value }}</span>
      </DescriptionsItem>
    </template>
  </Descriptions>
</template>

