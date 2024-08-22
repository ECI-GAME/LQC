<script setup lang="ts">
/**
 * @file 语言对选择
 * @author svon.me@gmail.com
 **/

import {computed} from "vue";
import Select from "./select.vue";

import type {PropType} from "vue";

const $emit = defineEmits(["update:value"]);
const props = defineProps({
  value: {
    required: false,
    default: () => [],
    type: Array as PropType<Array<string | number>>,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: () => false,
  },
});

const data = computed<Array<string | number>>({
  get: () => {
    return props.value;
  },
  set: (value: Array<string | number>) => {
    $emit("update:value", value);
  }
});

</script>

<template>
  <div class="flex items-center">
    <Select class="flex-1 ml-5 first:ml-0" v-model:value="data[0]" :disabled="disabled"
            placeholder="请选择源语言" :readonly="data[1]"></Select>
    <Select class="flex-1 ml-5 first:ml-0" v-model:value="data[1]" :disabled="disabled"
            placeholder="请选择目标语言" :readonly="data[0]"></Select>
  </div>
</template>

