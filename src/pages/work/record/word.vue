<script setup lang="ts">
import {DotType} from "src/components/preview/config";
import {Descriptions, DescriptionsItem} from "ant-design-vue";

import type {PropType} from "vue";
import type {DotData} from "src/components/preview/config";

defineProps({
  data: {
    required: true,
    type: Object as PropType<DotData>,
  }
});
</script>

<template>
  <Descriptions :column="1" :bordered="true" size="small">
    <DescriptionsItem label="类别">{{ DotType[data.imageFlag] }}</DescriptionsItem>
    <DescriptionsItem label="原文">{{ data.originalText }}</DescriptionsItem>
    <DescriptionsItem label="译文">{{ data.translatedText }}</DescriptionsItem>
  </Descriptions>
</template>
