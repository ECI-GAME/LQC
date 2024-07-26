<script setup lang="ts">
/**
 * @file 图片相关操作
 * @author svon.me@gmail.com
 */

import List from "./list.vue";
import Preview from "src/components/preview/index.vue";
import {Layout, LayoutContent, LayoutSider} from "ant-design-vue";
</script>

<template>
  <Layout class="!p-0 h-screen">
    <LayoutSider class="bg-white !w-80 !max-w-80 !flex-auto">
      <List class="h-full"></List>
    </LayoutSider>
    <LayoutContent class="border-x border-slate-600 border-solid">
      <Preview class="h-full"></Preview>
    </LayoutContent>
    <LayoutSider class="bg-white !w-80 !max-w-80 !flex-auto">
      <span>右侧内容</span>
    </LayoutSider>
  </Layout>
</template>

