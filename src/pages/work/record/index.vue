<script setup lang="ts">
/**
 * @file 操作记录
 * @author svon.me@gmail.com
 */

import Word from "./word.vue";
import Comment from "./comment.vue";
import {RecordType} from "./config";
import {Card, Button} from "ant-design-vue";

import type {PropType} from "vue";
import type {DotData} from "src/components/preview/config";

const $emit = defineEmits(["position"]);
defineProps({
  active: {
    type: [String, Number],
    required: true
  },
  list: {
    type: Array as PropType<DotData[]>,
    default: () => []
  }
});


// 查看图片描点位置
const onShowDetail = function (data: DotData) {
  $emit("position", data.id);
}

</script>

<template>
  <div>
    <Card class="mt-2 first:mt-0" size="small" v-for="item in list" :key="item.imageId">
      <template #title>
        <div class="flex items-center justify-between">
          <span>序号: {{ item.id }}</span>
          <Button class="p-0" type="link" @click="onShowDetail(item)">详情</Button>
        </div>
      </template>
      <template v-if="active === RecordType[0]">
        <Word :data="item"></Word>
      </template>
      <template v-else-if="active === RecordType[1]">
        <Comment :data="item"></Comment>
      </template>
    </Card>
  </div>
</template>
