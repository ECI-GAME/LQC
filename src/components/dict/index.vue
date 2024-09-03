<script setup lang="ts">
/**
 * @file 枚举信息查看
 * @author svon.me@gmail.com
 */

import api from "src/api";
import * as model from "src/utils/model";
import safeGet from "@fengqiaogang/safe-get";

import type {DictItem} from "src/types";

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: false,
  },
  name: {
    type: String,
    required: false,
  }
});

const {state} = model.list<DictItem>(function () {
  if (props.type) {
    return api.system.getDictData<DictItem>(props.type);
  }
  return new model.PageResult<DictItem>([]);
}, new model.PageResult<DictItem>([]), true);


//数据匹配
const pickValue = function (value?: string | number) {
  let res: string | number | undefined;
  const name = props.name || "dictValue";
  if (name && value) {
    for (const item of state.value.results) {
      const text = safeGet<string | number>(item, name);
      if (String(text) === String(value)) {
        res = item.dictLabel;
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
  <span>{{ pickValue(value) }}</span>
</template>
