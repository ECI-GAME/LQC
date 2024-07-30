<script setup lang="ts">
/**
 * @file 操作记录
 * @author svon.me@gmail.com
 */

import {ref} from "vue";
import Result from "./result.vue";
import Comment from "./comment.vue";
import {Card, Layout, LayoutContent, LayoutHeader, Segmented, Button} from "ant-design-vue";

const $emit = defineEmits(["position"]);
const options = ["已翻译文字", "批注"];

const active = ref<string>(options[1]);

const list = [{}, {}, {}, {}];


// 查看图片描点位置
const onShowDetail = function (data: object) {
  $emit("position", 200, 500)
}

</script>

<template>
  <Layout class="h-full">
    <LayoutHeader class="bg-white h-[initial] leading-[initial] p-2 border-b border-solid border-slate-300">
      <Segmented v-model:value="active" :options="options" :block="true" size="large"></Segmented>
    </LayoutHeader>
    <LayoutContent class="p-2 overflow-y-auto">

      <Card class="mt-2 first:mt-0" size="small" v-for="(item, index) in list" :key="index">
        <template #title>
          <div class="flex items-center justify-between">
            <span>序号: {{ index + 1 }}</span>
            <Space>
              <span class="font-normal"></span>
              <Button class="p-0" type="link" @click="onShowDetail(item)">详情</Button>
            </Space>
          </div>
        </template>
        <template v-if="active === options[0]">
          <Result :data="item"></Result>
        </template>
        <template v-else>
          <Comment :data="item"></Comment>
        </template>
      </Card>
    </LayoutContent>
  </Layout>
</template>
