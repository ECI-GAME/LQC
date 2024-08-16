<script setup lang="ts">
import api from "src/api";
import * as model from "src/utils/model";
import {Form, FormItem, Cascader, Textarea, Button} from "ant-design-vue";

import type {PropType} from "vue";
import type {DotData} from "src/components/preview/config";

const props = defineProps({
  data: {
    type: Object as PropType<DotData>,
    default: () => {
      return {};
    }
  },
  projectId: {
    type: [String, Number],
    required: true,
  },
});

const fieldNames = {
  value: "id",
  label: "errorTypeName",
  children: "childrenList"
}

// 任务明细列表
const {state: typeList} = model.list<object>(function () {
  return api.project.projectErrorType(props.projectId);
}, new model.PageResult<object>(), true);

</script>

<template>
  <Form layout="vertical" ref="formRef">
    <FormItem label="类别">
      <Cascader
          :value="Number(data.imageFlag)"
          placeholder="请选择类别"
          :options="typeList.results"
          :multiple="false"
          :allow-clear="false"
          :field-names="fieldNames" :disabled="true"></Cascader>
    </FormItem>
    <FormItem label="备注">
      {{ data.remark }}
    </FormItem>
    <div class="text-right">
      <Button type="primary">已解决</Button>
    </div>
  </Form>
</template>
