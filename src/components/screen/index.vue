<script setup lang="ts">
import {Icon} from "@ue/icon";
import {ref, computed} from "vue";
import {Button} from "ant-design-vue";
import safeGet from "@fengqiaogang/safe-get";

const $emit = defineEmits(["update:x1", "update:y1", "update:x2", "update:y2", "close"]);
const props = defineProps({
  x1: {
    type: Number,
    required: true
  },
  y1: {
    type: Number,
    required: true
  },
  x2: {
    type: Number,
    required: false,
    default: () => 0
  },
  y2: {
    type: Number,
    required: false,
    default: () => 0
  },
});

const x = ref<number>(props.x1);
const y = ref<number>(props.y1);
const width = ref<number>(props.x2 - props.x1);
const height = ref<number>(props.y2 - props.y1);

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

const onSync = function () {
  $emit("update:x1", x.value);
  $emit("update:y1", y.value);
  $emit("update:x2", x.value + width.value);
  $emit("update:y2", y.value + height.value);
}

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
  onSync();
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
  onSync();
};

const stopDrag = () => {
  dragging = false;
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);
};

const onClose = function () {
  $emit("close");
}

</script>

<template>
  <div class="absolute z-10 top-[var(--screen-y)] left-[var(--screen-x)] " :style="screenStyle">
    <div class="screen-box ease-in-out cursor-move" @mousedown="startDrag">
      <template v-for="name in direction" :key="name">
        <div class="screen-dot" :class="name" @mousedown="onResize($event, name)"></div>
      </template>
      <div class="absolute top-0 left-full inline-block transform -translate-y-4.5">
        <Button class="m-0 p-2" type="link" danger @click.stop.prevent="onClose">
          <Icon class="flex text-xl" type="close-circle-fill"></Icon>
        </Button>
      </div>
    </div>
    <div class="pt-3 -ml-1 min-w-60">
      <slot></slot>
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
