<script setup lang="ts">
import api from "src/api";
import * as _ from "lodash-es";
import {ref, onMounted} from "vue";
import * as model from "src/utils/model";
import {basename} from "src/utils/image";
import safeGet from "@fengqiaogang/safe-get";
import {ElButton as Button} from "element-plus";
import Select from "src/components/dict/select.vue";
import {Textarea, Cascader, Space} from "ant-design-vue";
import {DotData, DotDataType} from "src/components/preview/config";
import {RecordTabType, getTypeList, typeFieldNames, ImageOCR} from "../config";

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

const formData = ref<{ text?: string; imageFlag?: string | number | Array<string | number>; }>({
  text: void 0,          // 译文
  imageFlag: void 0,     // 类型
});

// 任务类型列表
const {state: typeList, execute: onLoadTypeList} = model.list<object>(async function () {
  const {list, db} = await getTypeList(props.projectId);
  const res = db.childrenDeep();
  const first = safeGet(res, "[0].children[0]");
  const firstValue = safeGet<string | number>(first, typeFieldNames.value);
  if (firstValue) {
    const parents = db.parentDeepFlatten({[db.primary]: firstValue});
    const list = parents.map((item: object) => safeGet<number>(item, typeFieldNames.value));
    const value = _.compact(_.reverse(list));
    formData.value = {
      imageFlag: value,
      text: formData.value.text,
    };
  }
  return list;
}, new model.PageResult<object>(), false);

const getResult = function (): DotData | undefined {
  const text = safeGet<string>(formData.value, "text");
  const imageFlag = safeGet<string | number>(formData.value, "imageFlag");
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

const onSubmit = _.debounce(async function () {
  let status = false;
  const value = getResult();
  if (value) {
    status = await api.work.word.add(value);
  }
  if (status) {
    $emit("save");
  }
}, 1000, {
  'leading': true,
  'trailing': false
})

const onOCR = _.debounce(async function () {
  const dot = props.corrdinate();
  const text = await ImageOCR(props.file.imagePath, dot, props.language, props.readOrder);
  if (text) {
    formData.value.text = text;
  }
}, 1000, {
  'leading': true,
  'trailing': false
});

const onKeydown = function (e: KeyboardEvent) {
  if (e.ctrlKey && e.key === "s") {
    e.stopPropagation();
    e.preventDefault();
    setTimeout(onSubmit);
  }
  if (e.ctrlKey && e.key === "e") {
    e.stopPropagation();
    e.preventDefault();
    setTimeout(onOCR);
  }
}

onMounted(async function () {
  if (textareaRef && textareaRef.value) {
    textareaRef.value.focus();
  }
  // 设置默认类型
  if (props.active === RecordTabType.Comment) {
    await onLoadTypeList(50);
  } else {
    formData.value.imageFlag = String(props.data.imageFlag || 6);
  }
});
</script>

<template>
  <div class="deep-[textarea]:resize-none">
    <div class="flex items-center justify-end">
      <div class="flex-1 max-w-50" v-if="active === RecordTabType.Comment">
        <Cascader class="w-full"
                  v-model:value="formData.imageFlag"
                  placeholder="请选择类别"
                  :options="typeList.results"
                  :multiple="false"
                  :allow-clear="false"
                  :field-names="typeFieldNames"></Cascader>
      </div>
      <div class="flex-1 max-w-50" v-else>
        <Select v-model:value="formData.imageFlag" placeholder="请选择类别" type="comic_ps_title_config"></Select>
      </div>
      <Space class="ml-3">
        <Button type="success" @click="onOCR">OCR</Button>
        <Button v-if="!formData.text || formData.text.length < 1" :disabled="true" class="bg-white">保存</Button>
        <Button v-else type="primary" @click="onSubmit">保存</Button>
      </Space>
    </div>
    <div class="mt-3">
      <Textarea ref="textareaRef" class="bg-[#fff] bg-opacity-90"
                v-model:value="formData.text"
                rows="5"
                :autofocus="true"
                @keydown.ctrl="onKeydown"
                placeholder="请输入原文"></Textarea>
    </div>
  </div>
</template>
