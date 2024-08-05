<script setup lang="ts">
/**
 * @file 图片相关操作
 * @author svon.me@gmail.com
 */

import api from "src/api";
import List from "./list.vue";
import * as _ from "lodash-es";
import {ref, computed} from "vue";
import {useRoute} from "vue-router";
import Record from "./record/index.vue";
import * as model from "src/utils/model";
import {RecordType} from "./record/config";
import Preview from "src/components/preview/index.vue";
import RegisterWord from "./register/word.vue";
import safeGet from "@fengqiaogang/safe-get";
import {Layout, LayoutContent, LayoutSider, LayoutHeader, Segmented} from "ant-design-vue";

import type {DotData} from "src/components/preview/config";

const previewRef = ref();
const route = useRoute();
const disabled = ref<boolean>();
const recordActive = ref<string>(RecordType[0]);

const workId = ref<string>(route.params.workId as string);

// 任务明细列表
const {state} = model.list<object>(function () {
  return api.task.getTaskFiles(route.params.taskId as string);
}, new model.PageResult<object>(), true);


// 记录点
const {state: dots} = model.list<DotData>(function () {
  return api.work.getDotList<DotData>(workId.value);
}, new model.PageResult<DotData>(), true);

// 当前选中对象详细数据
const currentFile = computed<object | undefined>(function () {
  const list = state.value.results;
  return _.find(list, function (item: object) {
    const id = safeGet<string | number>(item, "id")!;
    return String(id) === String(workId.value);
  });
})

// 切换左侧图片
const onChangeImage = function (value: string) {
  if (workId.value !== value) {
    workId.value = value;
    // dots.value = [];
  }
};

// 打点（描点）
const onChangeDot = function (data: DotData) {
  // disabled.value = true;
  // dots.value.push(data);
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
      <template v-if="state.total > 0">
        <List class="h-full" :active="workId" @change="onChangeImage" :list="state.results"></List>
      </template>
    </LayoutSider>
    <LayoutContent class="border-x border-slate-600 border-solid">
      <Preview v-if="currentFile"
               ref="previewRef"
               class="h-full"
               :src="safeGet(currentFile, 'originalImagePath')"
               :dots="dots" :disabled="disabled"
               :key="workId"
               @dot="onChangeDot"></Preview>
    </LayoutContent>
    <LayoutSider class="!w-80 !max-w-80 !flex-auto bg-[#fff]">
      <Layout class="h-full">
        <LayoutHeader class="bg-white h-[initial] leading-[initial] p-2 border-b border-solid border-slate-300">
          <Segmented v-model:value="recordActive" :options="RecordType" :block="true" size="large"
                     :disabled="true"></Segmented>
        </LayoutHeader>
        <LayoutContent class="p-2 overflow-y-auto">
          <template v-if="disabled">
            <RegisterWord :data="dots[0]" :file="currentFile"></RegisterWord>
          </template>
          <template v-else>
            <Record @position="onPosition" :active="recordActive" :key="recordActive" :list="dots.results"></Record>
          </template>
        </LayoutContent>
      </Layout>
    </LayoutSider>
  </Layout>
</template>

