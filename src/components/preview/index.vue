<script setup lang="ts">
import {ref} from "vue";
import {Icon} from "@ue/icon";
import BigNumber from "bignumber.js";
import safeGet from "@fengqiaogang/safe-get";
import * as image from "src/utils/brower/image";
import {DotDataType, DotData, scaleTipFormatter} from "./config";
import {downloadFile} from "src/utils/brower/download";
import Loading from "src/components/loading/index.vue";
import {Badge, Button, Layout, LayoutContent, LayoutHeader, Result, Slider, Space} from "ant-design-vue";

import type {PropType} from "vue";
import type {ImageData} from "src/types/image";

const $emit = defineEmits(["switch", "click"]);

const props = defineProps({
  data: {
    required: true,
    type: Object as PropType<ImageData>,
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
  },
});


const boxRef = ref();
const imageRef = ref();
const isLoading = ref(true);
const isLoadError = ref(false);
const key = ref<number>(Math.random());

const imageWidth = ref(0);
const imageHeight = ref(0);
const ratio = ref<number>(100);
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
  if (props.disabled) {
    return void 0;
  }
  // 获取点击事件中的坐标
  const clickX = safeGet<number>(e, "clientX")!;
  const clickY = safeGet<number>(e, "clientY")!;

  // 获取容器元素的位置
  const container = e.currentTarget as HTMLDivElement;
  const rect = container.getBoundingClientRect();

  // 计算相对于容器的坐标
  const x = clickX - rect.left - boxRef.value.scrollLeft;
  const y = clickY - rect.top - boxRef.value.scrollTop;

  $emit("click", e, {
    x,
    y,
    width: imageWidth.value,
    height: imageHeight.value
  });
}

const scrollValue = function () {
  const scale = getScale(ratio.value);
  return {
    scale,
    left: boxRef.value.scrollLeft,
    top: boxRef.value.scrollTop
  };
}

const setBoxScroll = function (dot: DotData) {
  const dom: HTMLDivElement = boxRef.value;
  if (dom) {
    const scale = getScale(ratio.value);
    const left = new BigNumber(dot.xCorrdinate1).times(scale).minus(20).toNumber();
    const top = new BigNumber(dot.yCorrdinate1).times(scale).minus(20).toNumber();
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

const setBoxDot = function (data: DotData) {
  setBoxScroll(data);
}


// 图片加载完成
const onLoad = function (e: Event) {
  if (e && e.target) {
    const image = e.target as HTMLImageElement;
    imageWidth.value = image.clientWidth;
    imageHeight.value = image.clientHeight;
  }
  isLoading.value = false;
  isLoadError.value = false;
}

const onError = function () {
  setTimeout(function () {
    isLoading.value = false;
    isLoadError.value = true;
  }, 500);
}

const onReload = function () {
  isLoading.value = true;
  isLoadError.value = false;
  key.value = Math.random();
}


defineExpose({setBoxScroll, setBoxDot, scrollValue});

</script>

<template>
  <Loading class="h-full" :status="isLoading">
    <Layout class="h-full">
      <LayoutHeader class="bg-white h-[initial] leading-[initial] px-2 border-b border-gray border-solid">
        <div class="flex items-center">
          <div class="flex-1 flex items-center">
            <Button class="px-0" type="link" @click="downloadFile(data.imagePath)" :disabled="isLoading || isLoadError">
              <Space :size="4">
                <Icon class="text-xl flex" type="download"></Icon>
                <span>下载</span>
              </Space>
            </Button>
            <a class="inline-block mx-3" :href="image.preview(data.imagePath)" target="_blank">
              <Button class="px-0" type="link" :disabled="isLoading || isLoadError">
                <Space :size="4">
                  <Icon class="text-xl flex" type="expend"></Icon>
                  <span>预览</span>
                </Space>
              </Button>
            </a>
            <span class="flex-1 w-1 truncate">{{ data.imageName }}</span>
          </div>
          <div class="w-20 flex-1 flex justify-end pl-10 pr-2">
            <Slider class="w-100 max-w-full"
                    :min="30"
                    :max="300"
                    :step="1"
                    :disabled="isLoading || isLoadError"
                    v-model:value="ratio"
                    :tip-formatter="scaleTipFormatter"
                    tooltip-placement="bottom"></Slider>
            <div>
              <Button class="scale-[0.65]" type="primary" shape="circle" @click="ratio = 100">
                <Icon class="text-xl" type="reload"></Icon>
              </Button>
            </div>
          </div>
          <div>
            <slot name="operate"></slot>
          </div>
        </div>
      </LayoutHeader>
      <LayoutContent class="overflow-hidden">
        <div class="h-full flex items-center justify-center" v-if="isLoadError">
          <Result status="500">
            <template #subTitle>
              <p>图片加载失败, 请尝试刷新或者联系管理员进行查看</p>
            </template>
            <template #extra>
              <Button type="primary" @click="onReload">Reload</Button>
            </template>
          </Result>
        </div>
        <div class="relative h-full" v-else>
          <div ref="boxRef" class="h-full overflow-auto w-full select-none ease-in-out"
               :style="`--image-scale: ${getScale(ratio)};`">
            <div class="relative inline-block origin-top-left scale-[var(--image-scale)]">
              <img ref="imageRef" class="no-drag inline-block max-w-[initial]" :src="data.imagePath" alt=""
                   crossorigin="anonymous" :key="`${ratio}-${key}`"
                   @click="onCaptureLocation" @load="onLoad" @error="onError"/>
              <div>
                <template v-for="(item, index) in dots" :key="index">
                  <span
                      class="inline-block cursor-pointer absolute left-[var(--dot-x)] top-[var(--dot-y)] transform -translate-x-1/2 -translate-y-1/2"
                      :style="`--dot-x: ${item.xCorrdinate1 || 0}px; --dot-y: ${item.yCorrdinate1 || 0}px;`">
                    <Badge v-if="String(item.coordinateType) === String(DotDataType.Comment)" :count="index + 1" color="orange"></Badge>
                    <Badge v-else :count="index + 1" color="blue"></Badge>
                  </span>
                </template>
              </div>
            </div>
          </div>
          <slot name="extend"></slot>
        </div>
      </LayoutContent>
    </Layout>
  </Loading>
</template>
