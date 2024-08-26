<script setup lang="ts">
import {ref} from "vue";
import api from "src/api";
import {Icon} from "@ue/icon";
import Tips from "./tips.vue";
import {useValidate} from "@ue/form";
import Textarea from "./textarea.vue";
import {basename} from "src/utils/image";
import safeGet from "@fengqiaogang/safe-get";
import {ElImage as Image} from 'element-plus';
import {preview} from "src/utils/brower/image";
import {changeTranslationList} from "../config";
import {DotData, DotMatchType} from "src/components/preview/config";
import {Button, Card, Form, FormItem, Select, SelectOption, Spin} from "ant-design-vue";

import type {PropType} from "vue";

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
    if (props.data && props.data.id) {
      const formValue = {...value, id: props.data.id}
      if (props.data.matchType && props.data.matchType !== DotMatchType.not) {
        // 审核 - 编辑
        status = await api.work.word.updateCheck(formValue);
      } else {
        // 正常编辑
        status = await api.work.word.update(formValue);
      }
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
  translationWord.value = changeTranslationList(data, translationWord.value);
}

</script>

<template>
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
                  v-model:text="model.translatedText"></Textarea>
    </FormItem>
    <Tips v-if="translationWord" class="deep-[.ant-descriptions-item-content]:text-primary"
          :word="translationWord"></Tips>
    <div class="flex items-center justify-between">
      <Button type="primary" danger @click="onCancel">取消</Button>
      <template v-if="props.data.matchType && props.data.matchType !== DotMatchType.not">
        <Button type="primary" @click="onSave">提交</Button>
      </template>
      <template v-else>
        <Button type="primary" @click="onSave">保存</Button>
      </template>
    </div>
  </Form>
</template>
