<script setup lang="ts">
import api from "src/api";
import * as _ from "lodash-es";
import {ref, onMounted} from "vue";
import {Textarea} from "ant-design-vue";
import {basename} from "src/utils/image";
import safeGet from "@fengqiaogang/safe-get";
import {DotData, DotDataType} from "src/components/preview/config";
import {RecordTabType, getTypeList, typeFieldNames} from "../config";

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
  corrdinate: {
    type: Function,
    required: true,
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

const textareaRef = ref();

const model = ref<{ text?: string; imageFlag?: string | number; }>({
  text: void 0,          // 译文
  imageFlag: void 0,     // 类型
});

const getResult = function (): DotData | undefined {
  const text = safeGet<string>(model.value, "text");
  const imageFlag = safeGet<string | number>(model.value, "imageFlag");
  if (text && _.size(_.trim(text)) > 0) {
    const corrdinate = props.corrdinate();
    const data = {
      imageFlag,
      taskId: safeGet<string | number>(props.file, "taskId")!,       //任务ID
      imageId: safeGet<string | number>(props.file, "imageId")!,     //图片ID
      imageName: props.data.imageName || basename(props.data.imagePath),   //图片名称
      imagePath: props.data.imagePath,                                     //图片路径
      xCorrdinate1: _.toInteger(corrdinate.xCorrdinate1),
      yCorrdinate1: _.toInteger(corrdinate.yCorrdinate1),
      xCorrdinate2: _.toInteger(corrdinate.xCorrdinate2),
      yCorrdinate2: _.toInteger(corrdinate.yCorrdinate2),
      imageWidth: _.toInteger(props.data.imageWidth),
      imageHeight: _.toInteger(props.data.imageHeight),
    } as DotData;
    // 类型标记
    if (props.active === RecordTabType.Comment) {
      data.coordinateType = DotDataType.Comment;
      data.remark = text;
    } else {
      data.coordinateType = DotDataType.Word;
      // 译文
      data.translatedText = props.data.translatedText;
      data.translatedHtml = props.data.translatedHtml;
      // 原文
      data.originalText = text;
      data.originalHtml = text;
    }
    return data;
  }
}

const onSubmit = async function () {
  let status = false;
  const value = getResult();
  if (value) {
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

onMounted(async function () {
  if (textareaRef && textareaRef.value) {
    textareaRef.value.focus();
  }
  // 设置默认类型
  if (props.active === RecordTabType.Comment) {
    const {db} = await getTypeList(props.projectId);
    const res = db.childrenDeep();
    const first = safeGet(res, "[0].children[0]");
    model.value.imageFlag = safeGet<string | number>(first, typeFieldNames.value);
  } else {
    model.value.imageFlag = String(props.data.imageFlag || 6);
  }
});
</script>

<template>
  <div class="deep-[textarea]:resize-none">
    <Textarea ref="textareaRef" class="bg-[#fff] bg-opacity-90"
              v-model:value="model.text"
              rows="5"
              :autofocus="true"
              @keydown.ctrl="onSave"
              placeholder="请输入原文"></Textarea>
  </div>
</template>
