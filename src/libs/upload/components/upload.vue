<script setup lang="ts">
/**
 * @file 文件上传
 * @author svon.me@gmail.com
 */

import {ref} from "vue"
import FileBox from "./file.vue";
import {onBeforeUploadFile, onUploadFile} from "./config";
import {Space, Button} from "ant-design-vue";
import {Icon} from "@ue/icon";

import type {PropType} from "vue";
import type {AcceptFun} from "./accept";
import type {Result} from "../util/upload/res";

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
    default: "*",
    required: false,
    type: [String, Function] as PropType<string | AcceptFun>
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
  // 单个文件大小限制, 单位 M
  maxSize: {
    type: Number,
    required: false,
    default: () => 0, // 0 表示无限制
  },
  // 启用多文件时, 文件数量上线
  limit: {
    type: Number,
    required: false,
    default: () => 0, // 0 表示无限制
  },
  bucket: {
    type: String,
    required: true,
  },
  action: {
    required: false,
    type: Function
  },
})

const fileRef = ref();
const dragenter = ref(false);

const onChange = function (file: File, progress: number, data?: Result) {
  $emit("change", file, progress, data);
}

const onUpload = async function (value: File[]) {
  $emit("update:loading", true);
  try {
    // 校验文件大小与格式
    await onBeforeUploadFile(props, value);
    // 开始上传
    if (props.action && typeof props.action === "function") {
      await Promise.resolve(props.action(value));
    } else {
      const res: Result[] = await onUploadFile(props, value, onChange);
      $emit("success", res);
    }
  } catch (e) {
    // 异常
    $emit("abnormal", e);
  } finally {
    setTimeout(function () {
      $emit("update:loading", false);
      if (fileRef.value) {
        fileRef.value.reset();
      }
    }, 300);
  }
}

const onClick = function () {
  if (fileRef.value) {
    fileRef.value.FileDialogBox();
  }
}

const onDragenter = function () {
  dragenter.value = true;
}

const onDrop = function (e: Event) {
  dragenter.value = false;
  if (props.drag) {
    // 如果当前为禁止上传
    if (props.disabled) {
      return false;
    }
    // 获取拖拽的文件并上传文件
    // @ts-ignore
    const dt = e.dataTransfer;
    const files = dt.files;
    onUpload(files);
  }
}

const onDragOver = function () {
  dragenter.value = false;
}

const onDragLeave = function () {
  dragenter.value = true;
};


</script>

<template>
  <div @dragenter.prevent="onDragenter" @drop.prevent="onDrop" @dragover.prevent="onDragOver" @dragleave="onDragLeave">
    <label>
      <FileBox ref="fileRef" :disabled="disabled" :accept="accept" :multiple="multiple"
               @change="onUpload"></FileBox>
    </label>
    <div class="inline-block" @click.stop.prevent="onClick">
      <slot :dragenter="drag ? dragenter : false" :disabled="disabled">
        <Button :disabled="disabled">
          <Space>
            <Icon class="flex text-xl" type="cloud-upload"></Icon>
            <span>文件上传</span>
          </Space>
        </Button>
      </slot>
    </div>
  </div>
</template>
