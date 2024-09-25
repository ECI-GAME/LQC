<script setup lang="ts">
/**
 * @file 枚举信息查看
 * @author svon.me@gmail.com
 */

import api from "src/api";
import * as _ from "lodash-es";
import * as model from "src/utils/model";
import safeGet from "@fengqiaogang/safe-get";

import type {DictItem} from "src/types";

const props = defineProps({
  type: {
    type: String,
    required: false,
  },
  value: {
    type: [String, Number],
    required: false,
  },
  autoValue: {
    type: [String, Number],
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  // 数据列表
  options: {
    type: Array,
    required: false,
  },
  fieldNames: {
    type: Object,
    required: false,
    default() {
      return {label: "dictLabel", value: "dictValue"};
    }
  },
});

const {state} = model.list<DictItem>(function () {
  if (props.options && _.size(props.options) > 0) {
    return new model.PageResult<DictItem>(props.options);
  }
  if (props.type) {
    return api.system.getDictData<DictItem>(props.type);
  }
  return new model.PageResult<DictItem>([]);
}, new model.PageResult<DictItem>([]), true);


//数据匹配
const pickValue = function (value?: string | number) {
  let res: string | number | undefined;
  const name = props.name || safeGet<string>(props.fieldNames, "value", "dictValue");
  if (name && value) {
    for (const item of state.value.results) {
      const text = safeGet<string | number>(item, name);
      if (String(text) === String(value)) {
        const key = safeGet<string>(props.fieldNames, "label") || "dictLabel";
        res = safeGet<string>(item, key);
        break;
      }
    }
  }
  return res;
}

</script>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "Dict"
});
</script>

<template>
  <span>{{ pickValue(value) || autoValue }}</span>
</template>
