<script setup lang="ts">
/**
 * @file 语言对展示
 * @author svon.me@gamil.com
 **/

import api from "src/api";
import * as model from "src/utils/model";
import safeGet from "@fengqiaogang/safe-get";

import type {LanguageData} from "src/types";

const props = defineProps({
// 如果 value 为空时, source & target 应为语言枚举值
  value: {
    type: Object,
    required: false,
  },
  source: {
    type: String,
    required: false,
    default: () => "sourceLanguage"
  },
  target: {
    type: String,
    required: false,
    default: () => "targetLanguage"
  },
});

const {state} = model.list<LanguageData>(function () {
    return api.system.getDictData<LanguageData>('comic_language_type');
  },
  new model.PageResult<LanguageData>([]),
  true
);


//语言映射
const pickLanguage = function (key: string, data?: object,) {
  let text = "-";
  const value = data ? safeGet<string>(data, key) : key;
  if (value) {
    for (const element of state.value.results) {
      if (value === element.code) {
        text = element.dictLabel;
        break;
      }
    }
  }
  return text;
}


</script>

<template>
  <span>
    <slot name="source" :list="state.results">
      <span class="language-source">{{ pickLanguage(source, value) }}</span>
    </slot>
    <span>-></span>
    <slot name="target" :list="state.results">
      <span class="language-target">{{ pickLanguage(target, value) }}</span>
    </slot>
  </span>
</template>

