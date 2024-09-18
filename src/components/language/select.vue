<script setup lang="ts">
/**
 * @file 单语言选择
 * @author svon.me@gmail.com
 **/

import api from "src/api";
import {computed} from "vue";
import * as model from "src/utils/model";
import {Select, SelectOption} from "ant-design-vue";

import type {PropType} from "vue";
import type {LanguageData} from "src/types";

const $emit = defineEmits(["update:value"]);
const props = defineProps({
  value: {
    type: [String, Number],
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: () => false,
  },
  placeholder: {
    type: String,
    required: false,
    default: () => "请选择",
  },
  readonly: {
    required: false,
    default: () => [],
    type: [Array, String, Number] as PropType<Array<string | number> | string | number>,
  }
});

const {state} = model.list<LanguageData>(function () {
    return api.system.getDictData<LanguageData>('comic_language_type');
  },
  new model.PageResult<LanguageData>([]),
  true
);

const code = computed<string | number>({
  get: () => {
    return props.value as (string | number);
  },
  set: (value: string | number) => {
    $emit("update:value", value);
  }
});

const isReadOnly = function (readonly: Array<string | number> | string | number = [], key: string | number): boolean {
  if (readonly) {
    if (Array.isArray(readonly)) {
      return readonly.includes(key);
    }
    return readonly === key;
  }
  return false;
}

</script>

<template>
  <div>
    <Select class="w-full"
            v-model:value="code"
            mode="combobox"
            :allow-clear="true"
            :show-search="true"
            :placeholder="placeholder"
            :disabled="disabled">
      <template v-for="item in state.results" :key="item.code">
        <SelectOption :value="item.code" :disabled="isReadOnly(readonly, item.code)">{{ item.dictLabel }}</SelectOption>
      </template>
    </Select>
  </div>
</template>

