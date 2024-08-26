<script setup lang="ts">
import Log from "./log.vue";
import Tips from "./tips.vue";
import {DotType} from "src/components/preview/config";
import {Descriptions, DescriptionsItem} from "ant-design-vue";

import type {PropType} from "vue";
import {DotData, DotMatchType} from "src/components/preview/config";

defineProps({
  data: {
    required: true,
    type: Object as PropType<DotData>,
  },
});


</script>

<template>
  <Descriptions :column="1" :bordered="true" size="small">
    <DescriptionsItem label="类别">{{ DotType[data.imageFlag] }}</DescriptionsItem>
    <DescriptionsItem label="原文" class="deep-[s]:text-[red]">
      <div v-html="data.originalHtml"></div>
    </DescriptionsItem>
    <DescriptionsItem label="译文">{{ data.translatedText }}</DescriptionsItem>
  </Descriptions>
  <template v-if="data.matchType">
    <template v-if="data.matchType === DotMatchType.match || data.matchType === DotMatchType.noUpdate">
      <Tips class="mt-5 deep-[.ant-descriptions-item-content]:text-[red]" :data="data"></Tips>
    </template>
    <template v-else-if="data.matchType === DotMatchType.update">
      <Log class="mt-5 deep-[.ant-descriptions-item-content]:text-green-700" :data="data"></Log>
    </template>
  </template>
</template>
