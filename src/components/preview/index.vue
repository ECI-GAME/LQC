<script setup lang="ts">
import {ref, nextTick} from "vue";
import api from "src/api";
import {Icon} from "@ue/icon";
import BigNumber from "bignumber.js";
import Cropper from "src/utils/cropper";
import Screen from "../screen/index.vue";
import Upload from "src/utils/upload/file";
import safeGet from "@fengqiaogang/safe-get";
import * as ImageUtil from "src/utils/image";
import {format} from "src/utils/upload/common";
import * as image from "src/utils/brower/image";
import {downloadFile} from "src/utils/brower/download";
import {ElLoading} from 'element-plus';
import Loading from "src/components/loading/index.vue";
import {Badge, Button, Layout, LayoutContent, LayoutHeader, Result, Slider, Space} from "ant-design-vue";
import {DotButton, DotData, DotDataType, isCheckStatus, scaleTipFormatter} from "./config";

import type {PropType} from "vue";
import type {ImageData} from "src/types/image";
import type {Screen as ScreenValue} from "../screen/config";

const $emit = defineEmits(["dot", "switch"]);

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
  readOrder: {
    type: String,
    required: true,
  },
  screenButtons: {
    required: false,
    default: () => [],
    type: Array as PropType<string[]>,
  }
});


const boxRef = ref();
const imageRef = ref();
const isLoading = ref(true);
const isLoadError = ref(false);
const key = ref<number>(Math.random());

const imageWidth = ref(0);
const imageHeight = ref(0);
const ratio = ref<number>(100);
const screenStatus = ref<boolean>(false);
const screenX = ref<number>(0);
const screenY = ref<number>(0);
const screenWidth = ref<number>();
const screenHeight = ref<number>();
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
  screenWidth.value = void 0;
  screenHeight.value = void 0;
  screenStatus.value = true;
}

// 关闭选区
const onRemoveScreen = function () {
  screenStatus.value = false
}

// 添加标记, 处理打点事件
const onClickDotButton = async function (res: object) {
  const type = safeGet<DotButton>(res, "type")!;
  const data = safeGet<ScreenValue>(res, "value")!;

  const scale = getScale(ratio.value);
  const result = new DotData(
    Number(new BigNumber(data.x1).plus(boxRef.value.scrollLeft).div(scale).toFixed(2)),
    Number(new BigNumber(data.y1).plus(boxRef.value.scrollTop).div(scale).toFixed(2)),
    Number(new BigNumber(data.x2).plus(boxRef.value.scrollLeft).div(scale).toFixed(2)),
    Number(new BigNumber(data.y2).plus(boxRef.value.scrollTop).div(scale).toFixed(2)),
    Number(imageWidth.value),
    Number(imageHeight.value)
  );

  if (type === DotButton.Crop) {
    result.coordinateType = DotDataType.Ocr;
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    try {
      const cropper = new Cropper(imageRef.value);
      // 裁剪获取 base64 图片数据
      const value = await cropper.cutXY(result.xCorrdinate1, result.yCorrdinate1, result.xCorrdinate2, result.yCorrdinate2);
      if (value) {
        // base64 数据转换为 File 对象
        const img = ImageUtil.base64ToImage(value);


        // 上传 File 获取图片地址
        const upload = new Upload([img]);
        const [data, text] = await Promise.all([
          upload.start(),
          //api.system.ocr(img)
          api.system.ocr(img, props.readOrder)
        ]);
        if (data && data[0]) {
          const image = format(data[0]);
          result.imagePath = image.src;
        }
        if (text) {
          result.originalText = text;
        }
      }
    } catch (e) {
      // todo
    } finally {
      setTimeout(() => {
        loading.close();
      }, 500);
    }
  } else if (isCheckStatus(props.data)) {
    result.coordinateType = DotDataType.Comment;
  } else {
    result.coordinateType = DotDataType.Word;
  }
  $emit("dot", result);
  onRemoveScreen();
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
  screenStatus.value = false;
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


defineExpose({setBoxScroll, setBoxDot});

</script>

<template>
  <Loading class="h-full" :status="isLoading">
    <Layout class="h-full">
      <LayoutHeader class="bg-white h-[initial] leading-[initial] px-2 border-b border-gray border-solid">
        <div class="flex items-center">
          <Space>
            <Button class="px-0" type="link" @click="downloadFile(data.imagePath)" :disabled="isLoading || isLoadError">
              <Space :size="4">
                <Icon class="text-xl flex" type="download"></Icon>
                <span>下载</span>
              </Space>
            </Button>
            <a class="inline-block" :href="image.preview(data.imagePath)" target="_blank">
              <Button class="px-0" type="link" :disabled="isLoading || isLoadError">
                <Space :size="4">
                  <Icon class="text-xl flex" type="expend"></Icon>
                  <span>预览</span>
                </Space>
              </Button>
            </a>
          </Space>
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
              <img ref="imageRef" class="inline-block max-w-[initial]" :src="data.imagePath" alt=""
                   crossorigin="anonymous" :key="`${ratio}-${key}`"
                   @click="onCaptureLocation" @load="onLoad" @error="onError"/>
              <div>
                <template v-for="(item, index) in dots" :key="index">
                  <span
                      class="inline-block cursor-pointer absolute left-[var(--dot-x)] top-[var(--dot-y)]"
                      :style="`--dot-x: ${item.xCorrdinate1 || 0}px; --dot-y: ${item.yCorrdinate1 || 0}px;`">
                    <Badge :count="index + 1" color="blue"></Badge>
                  </span>
                </template>
              </div>
            </div>
          </div>
          <Screen v-if="!disabled && screenStatus && screenButtons.length > 0"
                  :left="screenX"
                  :top="screenY"
                  :width="screenWidth"
                  :height="screenHeight"
                  :buttons="screenButtons"
                  @remove="onRemoveScreen"
                  @click="onClickDotButton"/>
        </div>
      </LayoutContent>
    </Layout>
  </Loading>
</template>
