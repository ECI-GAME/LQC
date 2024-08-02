<script setup lang="ts">
/**
 * @file 操作记录
 * @author svon.me@gmail.com
 */

import Word from "./word.vue";
import Comment from "./comment.vue";
import {RecordType} from "./config";
import {Card, Button, Space} from "ant-design-vue";

const $emit = defineEmits(["position"]);
defineProps({
  active: {
    type: [String, Number],
    required: true
  }
});

const list = [{}, {}, {}, {}];


// 查看图片描点位置
const onShowDetail = function (data: object) {
  $emit("position", 200, 500)
}

</script>

<template>
  <div>
    <Card class="mt-2 first:mt-0" size="small" v-for="(item, index) in list" :key="index">
      <template #title>
        <div class="flex items-center justify-between">
          <span>序号: {{ index + 1 }}</span>
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
