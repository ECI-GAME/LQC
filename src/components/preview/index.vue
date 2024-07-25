<script setup lang="ts">
import {ref, onMounted} from "vue";
import BigNumber from "bignumber.js";
import Screen from "../screen/index.vue";
import safeGet from "@fengqiaogang/safe-get";
import {Slider, Layout, LayoutContent, LayoutHeader, Badge, Space} from "ant-design-vue";

const src = "https://assets.vuejs.com/208e0972-71b8-5be4-a5c0-4d29ad1f6261/2987d30fc481516b82d3e976beb342e5.png";

const ratio = ref<number>(100);
const dots = ref<object[]>([]);

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
  const x = clickX - rect.left + container.scrollLeft;
  const y = clickY - rect.top + container.scrollTop;
  const scale = getScale(ratio.value);
  const value = {
    x: Number(new BigNumber(x).div(scale).toFixed(0)),
    y: Number(new BigNumber(y).div(scale).toFixed(0)),
  };
  console.log(value)
  // dots.value.push(value);
}

</script>

<template>
  <Layout>
    <LayoutHeader class="bg-white">
      <div class="flex items-center">
        <div class="flex-1">
          <Slider :min="50" :max="200" :step="1" v-model:value="ratio" :tooltip-open="false"></Slider>
        </div>
        <div class="pl-5">ratio = {{ ratio }}</div>
      </div>
    </LayoutHeader>
    <LayoutContent class="px-5">
      <div class="relative h-full">
        <div class="h-full overflow-auto w-full select-none" :style="`--image-scale: ${getScale(ratio)};`">
          <div class="relative inline-block origin-top-left scale-[var(--image-scale)]">
            <img class="inline-block" :src="src" :key="ratio" @click="onCaptureLocation"/>
            <div>
              <template v-for="(item, index) in dots" :key="index">
                  <span
                      class="inline-block cursor-pointer absolute left-[var(--dot-x)] top-[var(--dot-y)] -translate-x-1/2 -translate-y-1/2 p-2"
                      :style="`--dot-x: ${item.x}px; --dot-y: ${item.y}px;`">
                    <Badge :count="index + 1" color="blue"></Badge>
                  </span>
              </template>
            </div>
          </div>
        </div>
        <Screen></Screen>
      </div>
    </LayoutContent>
  </Layout>
</template>
