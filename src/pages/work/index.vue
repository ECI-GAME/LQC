<script setup lang="ts">
/**
 * @file 图片相关操作
 * @author svon.me@gmail.com
 */
import {ref} from "vue";
import BigNumber from "bignumber.js";
import {Slider, Layout, LayoutContent, LayoutHeader, LayoutSider} from "ant-design-vue";

const src = "https://assets.vuejs.com/208e0972-71b8-5be4-a5c0-4d29ad1f6261/2987d30fc481516b82d3e976beb342e5.png";

const ratio = ref<number>(100);

const clacScale = function (value: number) {
  let scale = 1;
  if (value > 100) {
    const num = new BigNumber(value).minus(100).div(10).toFixed(2);
    scale = 1 + Number(num);
  } else if (value < 100) {
    const num = new BigNumber(value).div(100).toFixed(2);
    scale = Number(num);
  }
  return `--image-scale: ${scale}`;
}

</script>

<template>
  <Layout class="!p-0 h-screen">
    <LayoutSider class="bg-white">ratio = {{ ratio }}</LayoutSider>
    <Layout>
      <LayoutHeader class="bg-white">
        <Slider :min="50" :max="200" :step="1" v-model:value="ratio" :tooltip-open="false"></Slider>
      </LayoutHeader>
      <LayoutContent>
        <div class="h-full overflow-auto w-full" :style="clacScale(ratio)">
          <div class="relative inline-block origin-top-left scale-[var(--image-scale)]">
            <img
                class="inline-block border border-slate-600 border-solid rounded-md"
                :src="src" :key="ratio"/>
            <div>
              <span class="absolute left-[10px] top-[10px]">999</span>
            </div>
          </div>
        </div>
      </LayoutContent>
    </Layout>
  </Layout>
</template>

