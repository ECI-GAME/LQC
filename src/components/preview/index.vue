<script setup lang="ts">
import {ref, onMounted} from "vue";
import api from "src/api";
import {Icon} from "@ue/icon";
import {DotData, scaleTipFormatter} from "./config";
import BigNumber from "bignumber.js";
import Cropper from "src/utils/cropper";
import Screen from "../screen/index.vue";
import Upload from "src/utils/upload/file";
import safeGet from "@fengqiaogang/safe-get";
import * as ImageUtil from "src/utils/image";
import {format} from "src/utils/upload/common";
import * as image from "src/utils/brower/image";
import {downloadFile} from "src/utils/brower/download";
import Loading from "src/components/loading/index.vue";
import {ElLoading} from 'element-plus';
import {Badge, Layout, LayoutContent, LayoutHeader, Slider, Space, Button, Result} from "ant-design-vue";

import type {PropType} from "vue";
import type {Screen as ScreenValue} from "../screen/config";

enum DotType {
  ocr = "ocr",
  location = "location",
}

const $emit = defineEmits(["dot", "switch"]);

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
const isLoading = ref(true);
const isLoadError = ref(false);
const key = ref<number>(Math.random());

const imageWidth = ref(0);
const imageHeight = ref(0);
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


  const scale = getScale(ratio.value);

  const res = new DotData(
    Number(new BigNumber(data.x1).plus(boxRef.value.scrollLeft).div(scale).toFixed(2)),
    Number(new BigNumber(data.y1).plus(boxRef.value.scrollTop).div(scale).toFixed(2)),
    Number(new BigNumber(data.x2).plus(boxRef.value.scrollLeft).div(scale).toFixed(2)),
    Number(new BigNumber(data.y2).plus(boxRef.value.scrollTop).div(scale).toFixed(2)),
    Number(imageWidth.value),
    Number(imageHeight.value)
  );

  if (type === DotType.ocr) {
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    try {
      const cropper = new Cropper(imageRef.value);
      // 裁剪获取 base64 图片数据
      const value = await cropper.cutXY(res.xCorrdinate1, res.yCorrdinate1, res.xCorrdinate2, res.yCorrdinate2);
      if (value) {
        // base64 数据转换为 File 对象
        const img = ImageUtil.base64ToImage(value);
        // 上传 File 获取图片地址
        const upload = new Upload([img]);
        const [data, text] = await Promise.all([
          upload.start(),
          api.system.ocr(img)
        ]);
        if (data && data[0]) {
          const image = format(data[0]);
          res.imagePath = image.src;
        }
        if (text) {
          res.originalText = text;
        }
      }
    } catch (e) {
      // todo
    } finally {
      setTimeout(() => {
        loading.close();
      }, 500);
    }
  }
  $emit("dot", res);

  onRemoveScreen();


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


defineExpose({setPosition});

</script>

<template>
  <Loading :status="isLoading">
    <Layout>
      <LayoutHeader class="bg-white h-[initial] leading-[initial] px-2 border-b border-gray border-solid">
        <div class="flex items-center">
          <Space>
            <Button class="px-0" type="link" @click="downloadFile(src)" :disabled="isLoading || isLoadError">
              <Space :size="4">
                <Icon class="text-xl flex" type="download"></Icon>
                <span>下载</span>
              </Space>
            </Button>
            <a class="inline-block" :href="image.preview(src)" target="_blank">
              <Button class="px-0" type="link" :disabled="isLoading || isLoadError">
                <Space :size="4">
                  <Icon class="text-xl flex" type="expend"></Icon>
                  <span>预览</span>
                </Space>
              </Button>
            </a>
          </Space>
          <div class="flex-1 flex justify-end px-10">
            <Slider class="w-100 max-w-full"
                    :min="30"
                    :max="300"
                    :step="1"
                    :disabled="isLoading || isLoadError"
                    v-model:value="ratio"
                    :tip-formatter="scaleTipFormatter"
                    tooltip-placement="bottom"></Slider>
          </div>
          <div>
            <slot name="operate"></slot>
          </div>
        </div>
      </LayoutHeader>
      <LayoutContent class="px-2 overflow-hidden">
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
              <img ref="imageRef" class="inline-block max-w-[initial]" :src="src" alt=""
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
          <Screen v-if="!disabled && screenStatus" :left="screenX" :top="screenY" @remove="onRemoveScreen"
                  @cropper="onAddDot($event, DotType.ocr)"
                  @location="onAddDot($event, DotType.location)"/>
        </div>
      </LayoutContent>
    </Layout>
  </Loading>
</template>
