<script setup lang="ts">
import {DotDataType} from "./config";
import {Badge} from "ant-design-vue";
import BigNumber from "bignumber.js";

import type {PropType} from "vue";
import type {DotData} from "./config";

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
  data: {
    required: true,
    type: Object as PropType<DotData>,
  },
});

const borderStyle = function (data: DotData) {
  return {
    width: `${new BigNumber(data.xCorrdinate2).minus(data.xCorrdinate1).toFixed(2)}px`,
    height: `${new BigNumber(data.yCorrdinate2).minus(data.yCorrdinate1).toFixed(2)}px`
  };
}


</script>

<template>
  <div class="node-item-view" :style="`--dot-x: ${data.xCorrdinate1 || 0}px; --dot-y: ${data.yCorrdinate1 || 0}px;`">
    <div class="node-border rounded" :style="borderStyle(data)"></div>
    <div class="relative z-1 cursor-pointer">
      <template v-if="String(data.coordinateType) === String(DotDataType.Comment)">
        <Badge :count="index + 1" color="orange"></Badge>
      </template>
      <template v-else>
        <Badge :count="index + 1" color="blue"></Badge>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.node-item-view {
  @apply inline-block;
  @apply absolute left-[var(--dot-x)] top-[var(--dot-y)];
  @apply transform -translate-x-1/2 -translate-y-1/2;
}

.node-border {
  @apply absolute left-1/2 top-1/2 z-0;
  @apply border border-solid border-lime-700;
  box-shadow: 0 7px 30px 0 rgba(101, 163, 13, 0.2);
}
</style>