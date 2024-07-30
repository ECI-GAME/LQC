<script setup lang="ts">
import {ref} from "vue";
import {Icon} from "@ue/icon";
import ORC from "src/utils/orc";
import {DotData} from "./config";
import BigNumber from "bignumber.js";
import Screen from "../screen/index.vue";
import safeGet from "@fengqiaogang/safe-get";
import * as image from "src/utils/brower/image";
import {downloadFile} from "src/utils/brower/download";
import {Badge, Layout, LayoutContent, LayoutHeader, Slider, Space, Button} from "ant-design-vue";

import type {PropType} from "vue";
import type {Screen as ScreenValue} from "../screen/config";

enum DotType {
  orc = "orc",
  location = "location",
}

const $emit = defineEmits(["dot"]);

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  dots: {
    required: false,
    default: () => [],
    type: Array as PropType<DotData[]>,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: () => false,
  }
});

const boxRef = ref();
const imageRef = ref();
const ratio = ref<number>(100);
const screenStatus = ref<boolean>(false);
const screenX = ref<number>(0);
const screenY = ref<number>(0);

const getScale = function (value: number) {
  let scale = 1;
  if (value > 100) {
    const num = new BigNumber(value).minus(100).div(10).toFixed(2);
    scale = 1 + Number(num);
  } else if (value < 100) {
    const num = new BigNumber(value).div(100).toFixed(2);
    scale = Number(num);
  }
  return scale;
}


const onCaptureLocation = function (e: Event) {
  // 获取点击事件中的坐标
  const clickX = safeGet<number>(e, "clientX")!;
  const clickY = safeGet<number>(e, "clientY")!;

  // 获取容器元素的位置
  const container = e.currentTarget as HTMLDivElement;
  const rect = container.getBoundingClientRect();

  // 计算相对于容器的坐标
  screenX.value = clickX - rect.left - boxRef.value.scrollLeft;
  screenY.value = clickY - rect.top - boxRef.value.scrollTop;
  screenStatus.value = true;
}

// 关闭选区
const onRemoveScreen = function () {
  screenStatus.value = false
}

// 添加标记
const onAddDot = async function (data: ScreenValue, type: DotType) {
  onRemoveScreen();
  const scale = getScale(ratio.value);
  const res = new DotData(
    Number(new BigNumber(data.x1).plus(boxRef.value.scrollLeft).div(scale).toFixed(2)),
    Number(new BigNumber(data.y1).plus(boxRef.value.scrollTop).div(scale).toFixed(2)),
    Number(new BigNumber(data.x2).plus(boxRef.value.scrollLeft).div(scale).toFixed(2)),
    Number(new BigNumber(data.y2).plus(boxRef.value.scrollTop).div(scale).toFixed(2))
  );
  if (type === DotType.orc) {
    try {
      const orc = new ORC(imageRef.value);
      res.image = await orc.cropperXY(res.x1, res.y1, res.x2, res.y2);
    } catch (e) {
      // todo
    }
  }
  $emit("dot", res);
}

const setPosition = function (x: number, y: number) {
  const dom: HTMLDivElement = boxRef.value;
  if (dom) {
    const scale = getScale(ratio.value);
    const left = new BigNumber(x).times(scale).toNumber();
    const top = new BigNumber(y).times(scale).toNumber();
    if (top <= 0) {
      dom.scrollTop = 0;
    } else {
      dom.scrollTop = top;
    }
    if (left < dom.clientWidth && dom.scrollLeft < left) {
      return;
    }
    if (left <= 0) {
      dom.scrollLeft = 0;
    } else {
      dom.scrollLeft = left;
    }
  }
}

defineExpose({setPosition});

</script>

<template>
  <Layout>
    <LayoutHeader class="bg-white h-[initial] leading-[initial] px-2">
      <div class="flex items-center">
        <Space>
          <Button class="px-0" type="link" @click="downloadFile(src)">
            <Space :size="4">
              <Icon class="text-xl flex" type="download"></Icon>
              <span>下载</span>
            </Space>
          </Button>
          <a class="inline-block" :href="image.preview(src)" target="_blank">
            <Button class="px-0" type="link">
              <Space :size="4">
                <Icon class="text-xl flex" type="expend"></Icon>
                <span>预览</span>
              </Space>
            </Button>
          </a>
        </Space>
        <div class="flex-1 flex justify-end">
          <Slider class="mx-0 w-100" :min="30" :max="300" :step="1" v-model:value="ratio"
                  :tooltip-open="false"></Slider>
        </div>
        <div class="pl-5">{{ ratio }}%</div>
      </div>
    </LayoutHeader>
    <LayoutContent class="px-2">
      <div class="relative h-full">
        <div ref="boxRef" class="h-full overflow-auto w-full select-none ease-in-out"
             :style="`--image-scale: ${getScale(ratio)};`">
          <div class="relative inline-block origin-top-left scale-[var(--image-scale)]">
            <img ref="imageRef" class="inline-block max-w-[initial]" :src="src" crossorigin="anonymous" :key="ratio"
                 @click="onCaptureLocation"/>
            <div>
              <template v-for="(item, index) in dots" :key="index">
                  <span
                      class="inline-block cursor-pointer absolute left-[var(--dot-x)] top-[var(--dot-y)]"
                      :style="`--dot-x: ${item.x1}px; --dot-y: ${item.y1}px;`">
                    <Badge :count="index + 1" color="blue"></Badge>
                  </span>
              </template>
            </div>
          </div>
        </div>
        <Screen v-if="!disabled && screenStatus" :left="screenX" :top="screenY" @remove="onRemoveScreen"
                @orc="onAddDot($event, DotType.orc)"
                @location="onAddDot($event, DotType.location)"/>
      </div>
    </LayoutContent>
  </Layout>
</template>
