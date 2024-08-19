<script setup lang="ts">
import api from "src/api";
import * as model from "src/utils/model";
import {DBList} from "@fengqiaogang/dblist";
import safeGet from "@fengqiaogang/safe-get";
import {Form, FormItem, Cascader, Textarea, Button, Descriptions, DescriptionsItem} from "ant-design-vue";

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

</script>

<template>
  <Descriptions class="deep-[th]:whitespace-nowrap" :column="1" :bordered="true" size="small">
    <DescriptionsItem label="类别">{{ getTypeValue(data.imageFlag) }}</DescriptionsItem>
    <DescriptionsItem label="备注">
      {{ data.remark }}
    </DescriptionsItem>
    <DescriptionsItem class="text-right">
      <Button type="primary">已解决</Button>
    </DescriptionsItem>
  </Descriptions>
</template>
