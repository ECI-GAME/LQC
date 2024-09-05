<script setup lang="ts">
import BigNumber from "bignumber.js";
import { Progress } from "ant-design-vue";

const props = defineProps({
  value: {
    required: false,
    default: () => 0,
    type: [String, Number],
  },
  total: {
    required: false,
    default: () => 0,
    type: [String, Number],
  }
});


//进度计算
const percent = function () {
  return new BigNumber(props.value).div(props.total).times(100).toNumber();
}
</script>

<template>
  <Progress :percent="percent()" status="active" :showInfo="true" :format="() => `${value} / ${total}`"/>
</template>
