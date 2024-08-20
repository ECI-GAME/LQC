<script setup lang="ts">
import {ref} from "vue";
import api from "src/api";
import {Icon} from "@ue/icon";
import {useValidate} from "@ue/form";
import {basename} from "src/utils/image";
import {preview} from "src/utils/brower/image";
import {ElImage as Image} from 'element-plus';
import safeGet from "@fengqiaogang/safe-get";
import Textarea from "./textarea.vue";
import {Card, Form, FormItem, Select, SelectOption, Button, Spin, Descriptions, DescriptionsItem} from "ant-design-vue";

import type {PropType} from "vue";
import type {DotData} from "src/components/preview/config";

const $emit = defineEmits(["save", "cancel"]);
const props = defineProps({
  data: {
    type: Object as PropType<DotData>,
    default: () => {
      return {};
    }
  },
  file: {
    type: Object,
    required: true,
  },
  projectId: {
    type: [String, Number],
    required: true,
  },
});

const {formRef, validate} = useValidate();
const translationWord = ref<object>();
const model = ref({
  imageFlag: String(props.data.imageFlag || 1), // 类型
  translatedText: props.data.translatedText,          // 译文
  translatedHtml: props.data.translatedHtml,
  originalText: props.data.originalText,              // 原文
  originalHtml: props.data.originalHtml,
});

const getResult = function () {
  return {
    ...model.value,
    taskId: safeGet<string | number>(props.file, "taskId"),  //任务ID
    imageId: safeGet<string | number>(props.file, "imageId"),     //图片ID
    imageName: props.data.imageName || basename(props.data.imagePath),    //图片名称
    imagePath: props.data.imagePath,              //图片路径
    xCorrdinate1: props.data.xCorrdinate1,
    yCorrdinate1: props.data.yCorrdinate1,
    xCorrdinate2: props.data.xCorrdinate2,
    yCorrdinate2: props.data.yCorrdinate2,
    imageWidth: props.data.imageWidth,
    imageHeight: props.data.imageHeight,
    coordinateType: props.data.coordinateType,
  };
};

const onSave = async function () {
  let status = await validate();
  if (status) {
    const value = getResult();
    console.log(value)
    if (props.data.id) {
      status = await api.work.word.update({...value, id: props.data.id});
    } else {
      status = await api.work.word.add(value);
    }
  }
  if (status) {
    $emit("save");
  }
}

const onCancel = function () {
  $emit("cancel");
}
const spinning = ref<boolean>(false);
const translateUuid = ref<number>(Math.random());
//google机翻接口
const translateMt = async function () {
  console.log(model.value.originalText);
  console.log(props.file.taskId);
  spinning.value = true
  const fromData = {
    'taskId': props.file.taskId,
    'content': model.value.originalText
  }
  const res = await api.Common.googleMt(fromData);
  if (res && res.content) {
    model.value.translatedText = res.content;
    model.value.translatedHtml = res.content;
    translateUuid.value = Math.random();
  }
  spinning.value = false
}

const onChangeTranslationList = function (data: string[][]) {
  const map = new Map<string, string>(translationWord.value ? Object.entries(translationWord.value) : void 0);
  for (const item of data) {
    const [key, value] = item;
    if (!map.has(key)) {
      map.set(key, value);
    }
  }
  if (map.size > 0) {
    translationWord.value = Object.fromEntries(map);
  } else {
    translationWord.value = void 0;
  }
}

</script>

<template>
  <Card size="small">
    <Form layout="vertical" ref="formRef" :model="model">
      <FormItem label="类别">
        <Select v-model:value="model.imageFlag">
          <SelectOption value="1">框内</SelectOption>
          <SelectOption value="2">框外</SelectOption>
        </Select>
      </FormItem>
      <FormItem v-if="data.imagePath">
        <a class="block" :href="preview(data.imagePath)" target="_blank">
          <Card class="deep-[.ant-card-body]:p-1">
            <Image class="w-full h-30" :src="data.imagePath" fit="cover"/>
          </Card>
        </a>
      </FormItem>

      <FormItem class="deep-[label]:w-full">
        <template #label>
          <div class="w-full flex items-center justify-between">
            <div>
              <span>原文</span>
            </div>
            <div>
              <Spin :spinning="spinning">
                <Icon class="text-xl text-primary cursor-pointer" type="font-size" @Click="translateMt"
                      :loading="true"></Icon>
              </Spin>
            </div>
          </div>
        </template>
        <Textarea :project-id="projectId"
                  v-model:html="model.originalHtml"
                  v-model:text="model.originalText"
                  @translation="onChangeTranslationList"></Textarea>
      </FormItem>
      <FormItem label="译文">
        <Textarea :key="translateUuid" :project-id="projectId"
                  v-model:html="model.translatedHtml"
                  v-model:text="model.translatedText"
                  @translation="onChangeTranslationList"></Textarea>
      </FormItem>
      <Descriptions v-if="translationWord" class="mb-5 deep-[th]:hidden" :column="1" :bordered="true" size="small">
        <template v-for="(name, value) in translationWord" :key="name">
          <DescriptionsItem>
            <span class="text-primary mr-3">{{ name }}:</span>
            <span class="text-primary">{{ value }}</span>
          </DescriptionsItem>
        </template>
      </Descriptions>

      <div class="flex items-center justify-between">
        <Button type="primary" danger @click="onCancel">取消</Button>
        <Button type="primary" @click="onSave">保存</Button>
      </div>
    </Form>
  </Card>
</template>
