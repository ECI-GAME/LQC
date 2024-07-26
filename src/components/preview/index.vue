<script setup lang="ts">
import {ref} from "vue";
import ORC from "src/utils/orc";
import {DotData} from "./config";
import BigNumber from "bignumber.js";
import Screen from "../screen/index.vue";
import safeGet from "@fengqiaogang/safe-get";
import {Badge, Layout, LayoutContent, LayoutHeader, Slider} from "ant-design-vue";

import type {Screen as ScreenValue} from "../screen/config";

enum DotType {
  orc = "orc",
  location = "location",
}

defineProps({
  src: {
    type: String,
    required: true,
  }
});

// const src = "https://assets.vuejs.com/208e0972-71b8-5be4-a5c0-4d29ad1f6261/2987d30fc481516b82d3e976beb342e5.png";

const boxRef = ref();
const imageRef = ref();
const ratio = ref<number>(100);
const dots = ref<DotData[]>([]);
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
  dots.value.push(res);
}

</script>

<template>
  <Layout>
    <LayoutHeader class="bg-white h-[initial]">
      <div class="flex items-center">
        <div class="flex-1">
          <Slider :min="50" :max="300" :step="1" v-model:value="ratio" :tooltip-open="false"></Slider>
        </div>
        <div class="pl-5">{{ ratio }}%</div>
      </div>
    </LayoutHeader>
    <LayoutContent class="px-5">
      <div class="relative h-full">
        <div ref="boxRef" class="h-full overflow-auto w-full select-none" :style="`--image-scale: ${getScale(ratio)};`">
          <div class="relative inline-block origin-top-left scale-[var(--image-scale)]">
            <img ref="imageRef" class="inline-block" :src="src" crossorigin="anonymous" :key="ratio"
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
        <Screen v-if="screenStatus" :left="screenX" :top="screenY" @remove="onRemoveScreen"
                @orc="onAddDot($event, DotType.orc)"
                @location="onAddDot($event, DotType.location)"/>
      </div>
    </LayoutContent>
  </Layout>
</template>
