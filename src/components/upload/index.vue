<script setup lang="ts">
/**
 * @file 文件上传
 * @author svon.me@gmail.com
 */


import {ref} from "vue";
import {computed} from "vue";
import * as _ from "lodash-es";
import {Icon} from "@ue/icon";
import {format} from "src/utils/upload/common";
import {Upload, BucketType} from "@js-lion/upload";

import type {PropType} from "vue";
import type {Result} from "@js-lion/upload";
import type {FileData} from "src/utils/upload/common";

const $emit = defineEmits([
  "success",
  "update:loading",
  "progress",
  "abnormal",
  "update:value",
  "change"
]);

const props = defineProps({
  // 记录所有的上传数据
  value: {
    type: [Array, String],
    required: false
  },
  // 是否多选，默认单选
  multiple: {
    type: Boolean,
    required: false,
    default: () => false
  },
  // 文件格式限制
  accept: {
    type: [String, Function],
    required: false,
    default: "*"
  },
  // 用于控制外层的 loading 状态
  loading: {
    type: Boolean,
    required: false,
    default: () => false
  },
  disabled: {
    type: Boolean,
    required: false,
    default: () => false
  },
  drag: {
    type: Boolean,
    required: false,
    default: () => false
  },
  // 单个文件大小限制
  // 单位 M
  maxSize: {
    type: Number,
    required: false,
    default: () => 0, // 0 表示无限制
  },
  // 启用多文件时，文件数量上线
  limit: {
    type: Number,
    required: false,
    default: () => 0, // 0 表示无限制
  },
  action: {
    required: false,
    type: Function
  },
  bucket: {
    required: false,
    type: String as PropType<BucketType>,
  }
});

const fileList = ref<FileData[]>([])

const status = computed({
  get: () => props.loading,
  set: (value) => {
    $emit("update:loading", value);
  }
});

const onSuccess = function (list: Result[]) {
  const res: FileData[] = _.map(list, format);
  const value = [...fileList.value, ...res];
  onUpdate(value);
  $emit("success", res);
}

const onUpdate = function (list: FileData[]) {
  const array = [...list];
  fileList.value = array;
  $emit("update:value", array);
  $emit("change", array);
}


const onProgress = function (...args: any[]) {
  $emit("progress", ...args);
}
const onAbnormal = function (...args: any[]) {
  $emit("abnormal", ...args);
}
</script>

<template>
  <div>
    <Upload v-model:loading="status"
            :multiple="multiple"
            :accept="accept"
            :disabled="disabled"
            :drag="drag"
            :max-size="maxSize"
            :limit="limit"
            :action="action"
            :bucket="bucket || BucketType.aliyun"
            @change="onProgress"
            @success="onSuccess"
            @abnormal="onAbnormal">
      <slot>
        <span class="flex items-center cursor-pointer">
          <Icon class="flex text-xl" type="cloud-upload"></Icon>
          <span class="ml-2">图片上传</span>
        </span>
      </slot>
    </Upload>
    <div :key="fileList.length">
      <slot name="preview" :files="fileList" :update="onUpdate"></slot>
    </div>
  </div>
</template>
