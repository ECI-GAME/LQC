<script setup lang="ts">
import api from "src/api";
import {ref} from "vue";
import {Icon} from "@ue/icon";
import {useValidate} from "@ue/form";
import {basename} from "src/utils/image";
import {preview} from "src/utils/brower/image";
import {ElImage as Image} from 'element-plus';
import safeGet from "@fengqiaogang/safe-get";
import {Card, Form, FormItem, Select, SelectOption, Textarea, Button} from "ant-design-vue";

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
  }
});

const {formRef, validate} = useValidate();
const model = ref({
  imageFlag: 1,                     // 类型
  translatedText: "",               // 译文
  originalText: props.data.originalText, // 原文
});

const getResult = function () {
  return {
    ...model.value,
    taskId: safeGet<string | number>(props.file, "taskId"),  //任务ID
    imageId: safeGet<string | number>(props.file, "id"),     //图片ID
    imageName: basename(props.data.imagePath),    //图片名称
    imagePath: props.data.imagePath,              //图片路径
    xCorrdinate1: props.data.xCorrdinate1,
    yCorrdinate1: props.data.yCorrdinate1,
    xCorrdinate2: props.data.xCorrdinate2,
    yCorrdinate2: props.data.yCorrdinate2,
    imageWidth : props.data.imageWidth,
    imageHeight : props.data.imageHeight,
  };
};

const onSave = async function () {
  let status = await validate();
  if (status) {
    const value = getResult();
    if (props.data.id) {
      status = await api.work.word.update({ ...value, id: props.data.id });
    } else {
      status = await api.work.word.add(value);
    }
  }
  if (status) {
    $emit("save");
  }
}

const onCancel = function() {
  $emit("cancel");
}

</script>

<template>
  <Card size="small">
    <Form layout="vertical" ref="formRef" :model="model">
      <FormItem label="类别">
        <Select v-model:value="model.imageFlag">
          <SelectOption :value="1">框内</SelectOption>
          <SelectOption :value="2">框外</SelectOption>
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
              <Icon class="text-xl text-primary cursor-pointer" type="font-size"></Icon>
            </div>
          </div>
        </template>
        <Textarea :rows="4" v-model:value="model.originalText"></Textarea>
      </FormItem>
      <FormItem label="译文">
        <Textarea :rows="4" v-model:value="model.translatedText"></Textarea>
      </FormItem>
      <div class="flex items-center justify-between">
        <Button type="primary" danger @click="onCancel">取消</Button>
        <Button type="primary" @click="onSave">保存</Button>
      </div>
    </Form>
  </Card>
</template>
