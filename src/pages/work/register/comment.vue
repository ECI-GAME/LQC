<script setup lang="ts">
import {ref} from "vue";
import api from "src/api";
import * as _ from "lodash-es";
import * as model from "src/utils/model";
import {useValidate, rules} from "@ue/form";
import safeGet from "@fengqiaogang/safe-get";
import {DotData, DotDataType} from "src/components/preview/config";
import {Form, FormItem, Cascader, Textarea, Button} from "ant-design-vue";

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
const formData = ref({
  imageFlag: void 0,        // 类型
  remark: "",               // 备注
});

const fieldNames = ref({
  value: "id",
  label: "errorTypeName",
  children: "childrenList"
})
// 任务明细列表
const {state: typeList} = model.list<object>(function () {
  return api.project.projectErrorType(props.projectId);
}, new model.PageResult<object>(), true);

const getResult = function () {
  const data = {
    ...formData.value,
    taskId: safeGet<string | number>(props.file, "taskId"),  //任务ID
    imageId: safeGet<string | number>(props.file, "imageId"),     //图片ID
    xCorrdinate1: _.toInteger(props.data.xCorrdinate1),
    yCorrdinate1: _.toInteger(props.data.yCorrdinate1),
    xCorrdinate2: _.toInteger(props.data.xCorrdinate2),
    yCorrdinate2: _.toInteger(props.data.yCorrdinate2),
    imageWidth: _.toInteger(props.data.imageWidth),
    imageHeight: _.toInteger(props.data.imageHeight),
    coordinateType: DotDataType.Comment,
  };
  return {...data, imageFlag: _.last(data.imageFlag)};
};


const onSave = async function () {
  let status = await validate();
  if (status) {
    const value = getResult();
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

</script>

<template>
  <Form layout="vertical" ref="formRef" :model="formData">
    <FormItem label="类别" name="imageFlag" :rules="rules.array('请选择类别！')">
      <Cascader
          v-model:value="formData.imageFlag"
          placeholder="请选择类别"
          :options="typeList.results"
          :multiple="false"
          :allow-clear="false"
          :field-names="fieldNames"></Cascader>
    </FormItem>
    <FormItem label="备注">
      <Textarea :rows="4" v-model:value="formData.remark"></Textarea>
    </FormItem>
    <div class="flex items-center justify-between">
      <Button type="primary" danger @click="onCancel">取消</Button>
      <Button type="primary" @click="onSave">保存</Button>
    </div>
  </Form>
</template>
