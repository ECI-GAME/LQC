<script setup lang="ts">
/**
 * @file 图片相关操作
 * @author svon.me@gmail.com
 */

import {ref} from "vue";
import List from "./list.vue";
import {DotData} from "src/components/preview/config";
import Preview from "src/components/preview/index.vue";
import {Layout, LayoutContent, LayoutSider} from "ant-design-vue";

const active = ref();
const disabled = ref<boolean>();
const dots = ref<DotData[]>([]);

// 切换左侧图片
const onChangeImage = function (value: string) {
  if (active.value !== value) {
    active.value = value;
    dots.value = [];
  }
};

// 打点（描点）
const onChangeDot = function (data: DotData) {
  dots.value.push(data);
}

</script>

<template>
  <Layout class="!p-0 h-screen">
    <LayoutSider class="bg-white !w-80 !max-w-80 !flex-auto">
      <List class="h-full" :active="active" @change="onChangeImage"></List>
    </LayoutSider>
    <LayoutContent class="border-x border-slate-600 border-solid">
      <Preview v-if="active" class="h-full" :src="active" :dots="dots" :disabled="disabled" :key="active"
               @dot="onChangeDot"></Preview>
    </LayoutContent>
    <LayoutSider class="bg-white !w-80 !max-w-80 !flex-auto">

    </LayoutSider>
  </Layout>
</template>

