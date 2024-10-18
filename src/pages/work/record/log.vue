<script setup lang="ts">
import api from "src/api";
import * as date from "src/utils/date";
import * as model from "src/utils/model";
import {Descriptions, DescriptionsItem} from "ant-design-vue";


import type {PropType} from "vue";
import type {DotCheckData} from "src/types";
import type {DotData} from "src/components/preview/config";


const props = defineProps({
  data: {
    required: true,
    type: Object as PropType<DotData>,
  },
});


// 枚举列表
const {state} = model.list<DotCheckData>(async function () {
  if (props.data) {
    return api.work.word.dotCheckList(props.data.id, props.data.imageId);
  }
  return new model.PageResult<DotCheckData>()
}, new model.PageResult<DotCheckData>(), true);

</script>

<template>
  <Descriptions v-if="state.total > 0" class="mb-5 deep-[th]:hidden" :column="1" :bordered="true" size="small">
    <template v-for="item in state.results" :key="item.id">
      <DescriptionsItem class="whitespace-pre-wrap">
        <span>{{ item.createBy }}</span>
        <span>在</span>
        <span class="px-1">{{ date.template(item.createTime) }}</span>
        <span>将内容</span>
        <span class="line-through px-1">{{ item.originalText }}</span>
        <span>变更为</span>
        <span class="text-[red] pl-1">{{ item.changeText }}</span>
        <span>。</span>
      </DescriptionsItem>
    </template>
  </Descriptions>
</template>

