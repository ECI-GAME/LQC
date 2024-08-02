<script setup lang="ts">
import {Icon} from "@ue/icon";
import BigNumber from "bignumber.js";
import {ref, computed, onMounted} from "vue";
import safeGet from "@fengqiaogang/safe-get";

import type { Screen } from "./config";

const $emit = defineEmits(["location", "orc", "remove"]);
const props = defineProps({
  left: {
    type: Number,
    required: true
  },
  top: {
    type: Number,
    required: true
  }
});

const x = ref<number>(0);
const y = ref<number>(0);
const width = ref<number>(200);
const height = ref<number>(120);

onMounted(function () {
  if (props.left > 0) {
    const num = new BigNumber(props.left).minus(new BigNumber(width.value).div(2)).toNumber();
    if (num > 0) {
      x.value = num;
    }
  }

  if (props.top > 0) {
    const num = new BigNumber(props.top).minus(new BigNumber(height.value).div(2)).toNumber();
    if (num > 0) {
      y.value = num;
    }
  }
});

const direction = ["left-top", "right-top", "left-bottom", "right-bottom"];

const screenStyle = computed<string[]>(function () {
  return [
    `--screen-x: ${x.value}px`,
    `--screen-y: ${y.value}px`,
    `--screen-width: ${width.value}px`,
    `--screen-height: ${height.value}px`
  ];
});

let startX = 0;
let startY = 0;
let startWidth = 0;
let startHeight = 0;
let startLeft = 0;
let startTop = 0;
let resizing = false;
let dragging = false;
let currentHandle: string;

const onResize = function (e: Event, type: string) {
  e.stopPropagation();
  e.preventDefault();
  resizing = true;
  currentHandle = type;
  startX = safeGet<number>(e, "clientX")!;
  startY = safeGet<number>(e, "clientY")!;
  startWidth = width.value;
  startHeight = height.value;
  startLeft = x.value;
  startTop = y.value;
  document.addEventListener('mousemove', resize);
  document.addEventListener('mouseup', stopResize);
}

const stopResize = () => {
  resizing = false;
  document.removeEventListener('mousemove', resize);
  document.removeEventListener('mouseup', stopResize);
};

const resize = (event: Event) => {
  if (!resizing) return;

  const dx = safeGet<number>(event, "clientX")! - startX;
  const dy = safeGet<number>(event, "clientY")! - startY;
  if (direction[0] === currentHandle) {
    // 左上角
    const w = startWidth - dx;
    const h = startHeight - dy;
    width.value = Math.abs(w);
    height.value = Math.abs(h);
    if (w < 0) {
      x.value = startLeft + dx - Math.abs(w);
    } else {
      x.value = startLeft + dx;
    }
    if (h < 0) {
      y.value = startTop + dy - Math.abs(h);
    } else {
      y.value = startTop + dy;
    }
  } else if (direction[3] === currentHandle) {
    // 右下角
    const w = startWidth + dx;
    const h = startHeight + dy;
    width.value = Math.abs(w);
    height.value = Math.abs(h);
    if (w < 0) {
      x.value = startLeft - Math.abs(w);
    }
    if (h < 0) {
      y.value = startTop - Math.abs(h);
    }
  } else if (direction[1] === currentHandle) {
    // 右上角
    const w = startWidth + dx;
    const h = startHeight - dy;
    width.value = Math.abs(w);
    height.value = Math.abs(h);
    if (w < 0) {
      x.value = startLeft - Math.abs(w);
    }
    if (h < 0) {
      y.value = startTop + dy - Math.abs(h);
    } else {
      y.value = startTop + dy;
    }
  } else if (direction[2] === currentHandle) {
    // 左下角
    const w = startWidth - dx;
    const h = startHeight + dy;
    width.value = Math.abs(w);
    height.value = Math.abs(h);
    if (w < 0) {
      x.value = startLeft + dx - Math.abs(w);
    } else {
      x.value = startLeft + dx;
    }
    if (h < 0) {
      y.value = startTop - Math.abs(h);
    }
  }
};

const startDrag = function (event: Event) {
  if (resizing) {
    // 如果当前正在进行大小调整，则禁止拖动
    return;
  }
  dragging = true;
  startX = safeGet<number>(event, "clientX")!;
  startY = safeGet<number>(event, "clientY")!;
  startLeft = x.value;
  startTop = y.value;
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
}

const drag = (event: Event) => {
  if (!dragging) return;
  const dx = safeGet<number>(event, "clientX")! - startX;
  const dy = safeGet<number>(event, "clientY")! - startY;
  x.value = startLeft + dx;
  y.value = startTop + dy;
};

const stopDrag = () => {
  dragging = false;
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);
};


const onRemove = function () {
  $emit("remove");
}

const getValue = function (): Screen {
  return {
    x1: x.value,
    y1: y.value,
    x2: x.value + width.value,
    y2: y.value + height.value
  };
}

const onOrc = function () {
  $emit("orc", getValue());
}

const onLocation = function () {
  $emit("location", getValue());
}

</script>

<template>
  <div class="absolute z-10 top-[var(--screen-y)] left-[var(--screen-x)] " :style="screenStyle">
    <div class="text-xl absolute left-full top-0 pl-2 -translate-y-1">
      <div class="flex bg-white rounded-full p-0.5 border border-solid border-primary">
        <Icon class="text-primary cursor-pointer" type="font-size" @click.stop.prevent="onOrc"></Icon>
      </div>
      <div class="flex bg-white rounded-full p-0.5 border border-solid border-primary mt-1">
        <Icon class="text-primary cursor-pointer" type="location-fill" @click.stop.prevent="onLocation"></Icon>
      </div>
      <div class="flex bg-white rounded-full p-0.5 border border-solid border-primary mt-1" @click.stop.prevent="onRemove">
        <Icon class="text-red-500 cursor-pointer" type="close-circle-fill"></Icon>
      </div>
    </div>
    <div class="screen-box ease-in-out cursor-move" @mousedown="startDrag">
      <template v-for="name in direction" :key="name">
        <div class="screen-dot" :class="name" @mousedown="onResize($event, name)"></div>
      </template>
    </div>

  </div>
</template>

<style scoped lang="scss">
.screen-box {
  @apply relative border border-primary border-solid w-[var(--screen-width)] h-[var(--screen-height)];
  box-shadow: 0 0 8px 3px theme("colors.primary");
}

.screen-dot {
  @apply w-2 h-2 absolute rounded-full bg-primary;
  &.left-top {
    @apply left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize;
  }

  &.right-top {
    @apply right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize;
  }

  &.left-bottom {
    @apply left-0 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize;
  }

  &.right-bottom {
    @apply right-0 bottom-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize;
  }
}
</style>
