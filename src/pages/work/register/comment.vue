<script setup lang="ts">
import {ref, toRaw} from "vue";
import {useValidate} from "@ue/form";
import safeGet from "@fengqiaogang/safe-get";
import {Form, FormItem, Select, SelectOption, Textarea, Button, Card} from "ant-design-vue";

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
  imageFlag: 1,             // 类型
  remark: "",               // 备注
});

const getResult = function () {
  return {
    ...model.value,
    taskId: safeGet<string | number>(props.file, "taskId"),  //任务ID
    imageId: safeGet<string | number>(props.file, "id"),     //图片ID
    xCorrdinate1: props.data.xCorrdinate1,
    yCorrdinate1: props.data.yCorrdinate1,
    xCorrdinate2: props.data.xCorrdinate2,
    yCorrdinate2: props.data.yCorrdinate2,
  };
};


const onSave = async function () {
  let status = await validate();
  if (status) {
    const value = toRaw(model.value);
    console.log(value);
  }
  if (status) {
    $emit("save");
  }
}

const onCancel = function () {
  $emit("cancel");
}

</script>

<template>
  <Card size="small">
    <Form layout="vertical" ref="formRef" :model="model">
      <FormItem label="类别">
        <Select v-model:value="model.imageFlag">
          <SelectOption :value="1">漏译</SelectOption>
          <SelectOption :value="2">翻译错误</SelectOption>
        </Select>
      </FormItem>
      <FormItem label="备注">
        <Textarea :rows="4" v-model:value="model.remark"></Textarea>
      </FormItem>
      <div class="flex items-center justify-between">
        <Button type="primary" danger @click="onCancel">取消</Button>
        <Button type="primary" @click="onSave">保存</Button>
      </div>
    </Form>
  </Card>
</template>
