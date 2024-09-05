<script setup lang="ts">
/**
 * @file 语言对展示
 * @author svon.me@gamil.com
 * @description detail 组件的扩展
 **/

import Detail from "./detail.vue";

defineProps({
  value: {
    type: String,
    required: true,
  }
});

const convert = function (text?: string) {
  // 拆分数据
  const [source = "", target = ""] = (text || "").split("->");
  // 构造数据
  return {
    sourceLanguage: String(source).trim(),
    targetLanguage: String(target).trim(),
  };
}

</script>

<template>
  <Detail :value="convert(value)"></Detail>
</template>
