<script setup lang="ts">
import api from "src/api";
import {ref} from "vue";
import * as _ from "lodash-es";
import {useValidate} from "@ue/form";
import {RecordTabType} from "../config";
import safeGet from "@fengqiaogang/safe-get";
import {Form, Textarea} from "ant-design-vue";
import {DotData, DotDataType} from "src/components/preview/config";

import type {PropType} from "vue";
import type {ImageData} from "src/types";

const $emit = defineEmits(["save"]);
const props = defineProps({
  data: {
    type: Object as PropType<DotData>,
    default: () => {
      return {};
    }
  },
  file: {
    type: Object as PropType<ImageData>,
    required: true,
  },
  projectId: {
    type: [String, Number],
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  readOrder: {
    type: String,
    required: true,
  },
  active: {
    type: [String, Number],
    required: true
  },
});

const {formRef, validate} = useValidate();

const model = ref({
  imagePath: props.data.imagePath,
  imageFlag: String(props.data.imageFlag || 6), // 类型
  translatedText: props.data.translatedText,          // 译文
  translatedHtml: props.data.translatedHtml,
  originalText: props.data.originalText,              // 原文
  originalHtml: props.data.originalHtml,
});

const getResult = function () {
  const data = {
    ...model.value,
    imageName: void 0,
    taskId: safeGet<string | number>(props.file, "taskId")!,  //任务ID
    imageId: safeGet<string | number>(props.file, "imageId")!,     //图片ID
    // imageName: props.data.imageName || basename(props.data.imagePath),    //图片名称
    // imagePath: props.data.imagePath,              //图片路径
    xCorrdinate1: _.toInteger(props.data.xCorrdinate1),
    yCorrdinate1: _.toInteger(props.data.yCorrdinate1),
    xCorrdinate2: _.toInteger(props.data.xCorrdinate2),
    yCorrdinate2: _.toInteger(props.data.yCorrdinate2),
    imageWidth: _.toInteger(props.data.imageWidth),
    imageHeight: _.toInteger(props.data.imageHeight),
    // 类型标记
    coordinateType: props.active === RecordTabType.Comment ? DotDataType.Comment : DotDataType.Word,
  } as DotData;
  data.translatedHtml = data.translatedText;
  return data;
};

const onSubmit = async function () {
  let status = await validate();
  if (status) {
    const value = getResult();
    status = await api.work.word.add(value);
  }
  if (status) {
    $emit("save");
  }
}

const onSave = function (e: KeyboardEvent) {
  if (e.ctrlKey && e.key === "s") {
    e.stopPropagation();
    e.preventDefault();
    setTimeout(onSubmit);
  }
}

</script>

<template>
  <Form class="deep-[textarea]:resize-none" layout="vertical" ref="formRef" :model="model">
    <Textarea v-model:value="model.translatedText" rows="5" @keydown.ctrl="onSave"></Textarea>
  </Form>
</template>
