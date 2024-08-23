<script setup lang="ts">
import Log from "./log.vue";
import Tips from "../register/tips.vue";
import {DotType} from "src/components/preview/config";
import {Descriptions, DescriptionsItem} from "ant-design-vue";

import type {PropType} from "vue";
import type {DotData} from "src/components/preview/config";

defineProps({
  data: {
    required: true,
    type: Object as PropType<DotData>,
  },
  index: {
    type: Number,
    required: true,
  }
});


const translationWord2 = {
  "术语1": "测试内容1",
  "术语2": "测试内容2"
};


</script>

<template>
  <Descriptions :column="1" :bordered="true" size="small">
    <DescriptionsItem label="类别">{{ DotType[data.imageFlag] }}</DescriptionsItem>
    <DescriptionsItem label="原文" class="deep-[s]:text-[red]">
      <template v-if="data.id === 101">
        <span>禁用词测试</span>
        <s>1111</s>
        <span>禁用词测试</span>
        <s>1111</s>
        <span>禁用词测试</span>
        <s>1111</s>
      </template>
      <template v-else>{{ data.originalText }}</template>
    </DescriptionsItem>
    <DescriptionsItem label="译文">{{ data.translatedText }}</DescriptionsItem>
  </Descriptions>
  <template v-if="data.id === 101">
    <Tips class="mt-5 deep-[.ant-descriptions-item-content]:text-[red]" :word="translationWord2"></Tips>
  </template>
  <template v-else-if="data.id === 102">
    <Log class="mt-5 deep-[.ant-descriptions-item-content]:text-green-700"></Log>
  </template>
</template>
