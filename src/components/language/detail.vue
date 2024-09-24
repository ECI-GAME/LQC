<script setup lang="ts">
/**
 * @file 语言对展示
 * @author svon.me@gamil.com
 **/

import Dict from "../dict/index.vue";
import safeGet from "@fengqiaogang/safe-get";

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
  input: {
    type: Boolean,
    required: false,
  }
});

const DictTypeValue = "comic_language_type";

const pickLanguageValue = function (key: string, data?: object,) {
  return data ? safeGet<string>(data, key) : key;
}

const inputStyle = function (status: boolean) {
  if (status) {
    return "block min-h-8 leading-8 border border-solid border-[#d9d9d9] rounded-md px-1 text-sm";
  }
}

</script>

<template>
  <span :class="inputStyle(input)">
    <Dict :type="DictTypeValue" name="code" :value="pickLanguageValue(source, value)"></Dict>
    <span>-></span>
    <Dict :type="DictTypeValue" name="code" :value="pickLanguageValue(target, value)"></Dict>
  </span>
</template>

