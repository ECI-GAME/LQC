<script setup lang="ts">
import api from "src/api";
import {computed} from "vue";
import * as model from "src/utils/model";
import {Select} from "ant-design-vue";

import type {DictItem} from "src/types";

const $emit = defineEmits(["update:value", "change"]);
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  value: {
    type: [Array, String, Number],
    required: false,
  },
  fieldNames: {
    type: Object,
    required: false,
    default() {
      return {label: "dictLabel", value: "dictValue"};
    }
  },
  options: {
    type: Array,
    required: false,
  }
});

const {state} = model.list<DictItem>(function () {
  // 如果有传入数据源，则直接使用
  if (props.options && props.options.length > 0) {
    return new model.PageResult<DictItem>(props.options);
  }
  // 如果有指定枚举 code
  if (props.type) {
    // 获取枚举列表
    return api.system.getDictData<DictItem>(props.type);
  }
  // 返回空数据
  return new model.PageResult<DictItem>([]);
}, new model.PageResult<DictItem>([]), true);

const data = computed({
  get: () => props.value,
  set: (value: any) => {
    $emit("change", value);
    $emit("update:value", value);
  }
});

</script>

<template>
  <Select class="w-full" v-model:value="data" :fieldNames="fieldNames" :options="state.results"></Select>
</template>
