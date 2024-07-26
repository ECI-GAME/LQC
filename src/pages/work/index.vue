<script setup lang="ts">
/**
 * @file 图片相关操作
 * @author svon.me@gmail.com
 */

import { ref } from "vue";
import List from "./list.vue";
import Preview from "src/components/preview/index.vue";
import {Layout, LayoutContent, LayoutSider} from "ant-design-vue";

const active = ref();

</script>

<template>
  <Layout class="!p-0 h-screen">
    <LayoutSider class="bg-white !w-80 !max-w-80 !flex-auto">
      <List class="h-full" v-model:active="active"></List>
    </LayoutSider>
    <LayoutContent class="border-x border-slate-600 border-solid">
      <Preview v-if="active" class="h-full" :src="active" :key="active"></Preview>
    </LayoutContent>
    <LayoutSider class="bg-white !w-80 !max-w-80 !flex-auto">
      <span>右侧内容</span>
    </LayoutSider>
  </Layout>
</template>

