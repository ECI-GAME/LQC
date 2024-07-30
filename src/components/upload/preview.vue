<script setup lang="ts">
/*
 * @file 上传文件预览
 * @author svon.me@gmail.com
 **/

import {Tag} from "ant-design-vue";

import type {PropType} from "vue";
import type {FileData} from "src/utils/upload/common";

const $emit = defineEmits(["update:list", "remove", "change"])
const props = defineProps({
  list: {
    type: Array as PropType<FileData[]>,
    default: () => []
  }
});

const onRemove = function (data: FileData) {
  const list = [];
  for (const item of props.list) {
    if (item.fileName === data.fileName || item.fileName === data.name) {
      continue;
    } else {
      list.push(item);
    }
  }
  $emit("remove", data);
  $emit("update:list", list);
  $emit("change", list);
}

</script>

<template>
  <div class="clearfix">
    <div class="-mt-2">
      <div class="mt-2 mr-2 inline-flex" v-for="item in list">
        <Tag type="primary" :closable="true" @close="onRemove(item)">{{ item.name || item.fileName }}</Tag>
      </div>
    </div>
  </div>
</template>
