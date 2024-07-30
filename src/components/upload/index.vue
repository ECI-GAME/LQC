<script setup>
/**
 * @file 文件上传
 * @author svon.me@gmail.com
 */


import {computed} from "vue";
import * as _ from "lodash-es";
import {Icon} from "@ue/icon";
import {Upload} from "@js-lion/upload";
import * as config from "src/utils/upload/common";

const $emit = defineEmits(["success", "update:loading", "change", "abnormal"]);

const props = defineProps({
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
  }
});

const status = computed({
  get: () => props.loading,
  set: (value) => {
    $emit("update:loading", value);
  }
});

const onSuccess = function (list) {
  const res = _.map(list, config.format);
  $emit("success", res);
}
const onChange = function (...args) {
  // $emit("change", ...args);
}
const onAbnormal = function (...args) {
  $emit("abnormal", ...args);
}
</script>

<template>
  <div>
    <Upload
        :multiple="multiple"
        :accept="accept"
        v-model:loading="status"
        :disabled="disabled"
        :drag="drag"
        :max-size="maxSize"
        :limit="limit"
        :bucket="config.Bucket" @change="onChange" @success="onSuccess" @abnormal="onAbnormal">
      <slot>
        <span class="flex items-center">
          <Icon class="flex text-xl" type="cloud-upload"></Icon>
          <span>上传</span>
        </span>
      </slot>
    </Upload>
  </div>
</template>
