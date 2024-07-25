<script setup lang="ts">
import {ref, computed} from "vue";
import safeGet from "@fengqiaogang/safe-get";

const x = ref<number>(100);
const y = ref<number>(100);
const width = ref<number>(200);
const height = ref<number>(120);

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
</script>

<template>
  <div class="screen-box ease-in-out" :style="screenStyle">
    <template v-for="name in direction" :key="name">
      <div class="screen-dot" :class="name" @mousedown="onResize($event, name)"></div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.screen-box {
  @apply absolute z-10 border border-primary border-solid top-[var(--screen-y)] left-[var(--screen-x)] w-[var(--screen-width)] h-[var(--screen-height)];
}

.screen-dot {
  @apply w-2 h-2 absolute rounded-full bg-primary cursor-move;
  &.left-top {
    @apply left-0 top-0 -translate-x-1/2 -translate-y-1/2;
  }

  &.right-top {
    @apply right-0 top-0 translate-x-1/2 -translate-y-1/2;
  }

  &.left-bottom {
    @apply left-0 bottom-0 -translate-x-1/2 translate-y-1/2;
  }

  &.right-bottom {
    @apply right-0 bottom-0 translate-x-1/2 translate-y-1/2;
  }
}
</style>
