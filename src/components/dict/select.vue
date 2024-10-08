<script setup lang="ts">
import api from "src/api";
import {computed} from "vue";
import {Select} from "ant-design-vue";
import * as model from "src/utils/model";
import {DBList} from "@fengqiaogang/dblist";
import safeGet from "@fengqiaogang/safe-get";

import type {DictItem} from "src/types";

const $emit = defineEmits(["update:value", "change"]);
const props = defineProps({
  type: {
    type: String,
    required: false,
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
  // 数据列表
  options: {
    type: [Array, Function],
    required: false,
  },
  // 禁用状态
  disabled: {
    type: Boolean,
    required: false,
    default: () => false,
  },
  // 设置某些数据为只读属性
  readonly: {
    type: Array,
    required: false,
    default: () => [],
  },
  placeholder: {
    type: String,
    required: false,
  }
});

const {state} = model.list<DictItem>(function () {
  // 如果有传入数据源，则直接使用
  if (props.options) {
    if (Array.isArray(props.options) && props.options.length > 0) {
      return new model.PageResult<DictItem>(props.options);
    }
    if (typeof props.options === "function") {
      return props.options();
    }
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

const filterProp = computed<string | undefined>(() => {
  return safeGet<string>(props.fieldNames, "label");
});

const toOptions = function (list: object[]): object[] {
  // 判断是否油只读数据需要设置
  if (props.readonly && props.readonly.length > 0) {
    const childrenName = safeGet<string>(props.fieldNames, "options") || "children";
    const db = new DBList<object>([], safeGet<string>(props.fieldNames, "value"));
    db.insert(list, childrenName);
    // 查询数据并修改
    db.update({[db.primary]: props.readonly}, {disabled: true});
    // 返回数据
    return db.childrenDeep(void 0, childrenName);
  }
  return list;
}

</script>

<template>
  <Select class="w-full"
          v-model:value="data"
          :fieldNames="fieldNames"
          :options="toOptions(state.results)"
          :disabled="disabled"
          :option-filter-prop="filterProp"
          :placeholder="placeholder"
          not-found-content="暂无数据">
  </Select>
</template>
