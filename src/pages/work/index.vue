<script setup lang="ts">
/**
 * @file 图片相关操作
 * @author svon.me@gmail.com
 */

import {ref} from "vue";
import List from "./list.vue";
import Record from "./record/index.vue";
import {RecordType} from "./record/config";
import Preview from "src/components/preview/index.vue";
import RegisterWord from "./register/word.vue";
import {Layout, LayoutContent, LayoutSider, LayoutHeader, Segmented} from "ant-design-vue";

import {DotData} from "src/components/preview/config";

const active = ref();
const previewRef = ref();
const disabled = ref<boolean>();
const dots = ref<DotData[]>([
  new DotData(0, 0, 0, 0, "https://assets.vuejs.com/7bacc80b-26f0-5fe5-a8f2-8d15c3eeabd2/b3682056205a591d902040b236307157.png?filename=1722589164674_image.png")
]);
const recordActive = ref<string>(RecordType[0]);


// 切换左侧图片
const onChangeImage = function (value: string) {
  if (active.value !== value) {
    active.value = value;
    // dots.value = [];
  }
};

// 打点（描点）
const onChangeDot = function (data: DotData) {
  dots.value.push(data);
}

const onPosition = function (x: number, y: number) {
  const image = previewRef.value;
  if (image && image.setPosition) {
    image.setPosition(x, y);
  }
}

</script>

<template>
  <Layout class="!p-0 h-screen">
    <LayoutSider class="bg-white !w-80 !max-w-80 !flex-auto">
      <List class="h-full" :active="active" @change="onChangeImage"></List>
    </LayoutSider>
    <LayoutContent class="border-x border-slate-600 border-solid">
      <Preview ref="previewRef" v-if="active" class="h-full" :src="active" :dots="dots" :disabled="disabled"
               :key="active"
               @dot="onChangeDot"></Preview>
    </LayoutContent>
    <LayoutSider class="!w-80 !max-w-80 !flex-auto bg-[#fff]">
      <Layout class="h-full">
        <LayoutHeader class="bg-white h-[initial] leading-[initial] p-2 border-b border-solid border-slate-300">
          <Segmented v-model:value="recordActive" :options="RecordType" :block="true" size="large" :disabled="true"></Segmented>
        </LayoutHeader>
        <LayoutContent class="p-2 overflow-y-auto">
          <!--          <Record @position="onPosition" :active="recordActive" :key="recordActive"></Record>-->
          <RegisterWord :data="dots[0]"></RegisterWord>
        </LayoutContent>
      </Layout>
    </LayoutSider>
  </Layout>
</template>

