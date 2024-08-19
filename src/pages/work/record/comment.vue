<script setup lang="ts">
import api from "src/api";
import {ref, toRaw} from "vue";
import * as model from "src/utils/model";
import {useValidate, rules} from "@ue/form";
import {DBList} from "@fengqiaogang/dblist";
import safeGet from "@fengqiaogang/safe-get";
import {Form, FormItem, Select, Button, Descriptions, DescriptionsItem} from "ant-design-vue";

import type {PropType} from "vue";
import type {DotData} from "src/components/preview/config";

const $emit = defineEmits(["success"]);

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

class FormData {
  public solution: string[];

  constructor(solution: string | number | Array<string> | Array<number> = []) {
    // @ts-ignore
    const list = [].concat(solution);
    this.solution = list.map(value => String(value));
  }
}

const {formRef, validate} = useValidate();
const formData = ref<FormData>(new FormData());

const fieldNames = {
  label: "dictLabel",
  value: "dictLabel"
};

// 枚举列表
const {state: enumList} = model.list<object>(async function () {
  const res = await api.system.getDictData('comic_notes_solution');
  const value = safeGet<string>(res.results, `[0].${fieldNames.value}`);
  if (value) {
    setTimeout(() => {
      formData.value = new FormData(value);
    });
  }
  return res;
}, new model.PageResult<object>(), true);

// 任务明细列表
const {state: typeList} = model.list<object>(function () {
  return api.project.projectErrorType(props.projectId);
}, new model.PageResult<object>(), true);

const getTypeValue = function (key: string | number) {
  if (key) {
    const db = new DBList([], "id", "pid");
    db.insert(typeList.value.results, "childrenList");
    const list = db.parentDeepFlatten({[db.primary]: [key, String(key), Number(key)]});
    return list.reverse().map((item: object) => safeGet(item, "errorTypeName")).join("/");
  }
}

const onChangeType = function (value: string[]) {
  let text: string[] = [];
  if (value.length > 0) {
    text = value.slice(-1);
  }
  formData.value = new FormData(text);
}

const onSubmit = async function () {
  let status = await validate();
  if (status) {
    const value = toRaw(formData.value);
    // 修改数据状态
    status = await api.work.word.update({
      id: props.data.id,
      solution: value.solution[value.solution.length - 1]
    });
  }
  if (status) {
    $emit("success");
  }
}

</script>

<template>
  <Form :model="formData" ref="formRef">
    <Descriptions class="deep-[table]:!table-fixed" :column="1" :bordered="true" size="small">
      <DescriptionsItem label="类别">{{ getTypeValue(data.imageFlag) }}</DescriptionsItem>
      <DescriptionsItem label="备注">{{ data.remark || "--" }}</DescriptionsItem>
      <template v-if="String(data['solutionStatus']) !== '1'">
        <!-- 0:未解决 1: 已解决 -->
        <DescriptionsItem label="方案">
          <FormItem class="mb-0 deep-[.ant-form-show-help]:hidden" name="solution" :rules="rules.array()">
            <Select class="w-full"
                    v-model:value="formData.solution"
                    mode="tags"
                    :field-names="fieldNames"
                    placeholder="解决方案"
                    :allow-clear="true"
                    :auto-clear-search-value="true"
                    :max-tag-count="1"
                    not-found-content="请填写解决方案"
                    :options="enumList.results"
                    @change="onChangeType"></Select>
          </FormItem>
        </DescriptionsItem>
        <DescriptionsItem class="text-right">
          <FormItem class="mb-0">
            <Button type="primary" @click="onSubmit">已解决</Button>
          </FormItem>
        </DescriptionsItem>
      </template>
    </Descriptions>
  </Form>
</template>
