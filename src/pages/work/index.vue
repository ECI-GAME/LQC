<script setup lang="ts">
/**
 * @file 图片相关操作
 * @author svon.me@gmail.com
 */

import api from "src/api";
import * as _ from "lodash-es";

import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import Record from "./record/index.vue";
import * as model from "src/utils/model";
import {RecordType} from "./record/config";
import Preview from "src/components/preview/index.vue";
import RegisterWord from "./register/word.vue";
import RegisterComment from "./register/comment.vue";
import Tab from "src/components/tab/index.vue";
import Switch from "./switch.vue";
import TaskTitle from "src/components/task/title.vue";
import {ProcessNode, pickImage, filterSuccess} from "./config";
import {Layout, LayoutContent, LayoutHeader, Space, Button, LayoutSider} from "ant-design-vue";

import type {ImageData} from "src/types/image";
import type {DotData} from "src/components/preview/config";

const previewRef = ref();
const route = useRoute();
const recordActive = ref<string>(RecordType[0]);
const dotAddTempValue = ref<DotData>();
const processNode = ref<ProcessNode>();

onMounted(function () {
  const id = String(route.params.workId);
  if (id === "26") {
    processNode.value = ProcessNode.DTP;
  } else {
    processNode.value = ProcessNode.TEP;
  }
});

const currentFile = ref<ImageData>();
// 任务明细列表
const {state} = model.list<ImageData>(async function () {
  const res = await api.work.getImages<ImageData>(route.params.taskId as string);
  if (res.total > 0) {
    currentFile.value = pickImage(res.results, route.params.workId as string);
    setTimeout(onUpDataDots);
  }
  return res;
}, new model.PageResult<ImageData>(), true);


// 记录点
const {state: dots, execute: onReloadDots, isLoading} = model.list<DotData>(function () {
  if (recordActive.value === RecordType[0] && currentFile.value) {
    return api.work.getDotList<DotData>(currentFile.value.id);
  }
  return new model.PageResult<DotData>();
}, new model.PageResult<DotData>(), false);

const onUpDataDots = function () {
  onReloadDots(100);
  dotAddTempValue.value = void 0;
}


// 切换左侧图片
const onChangeImage = function (value: string) {
  // if (workId.value !== value) {
  //   workId.value = value;
  //   // dots.value = [];
  // }
};

// 打点（描点）
const onChangeDot = function (data: DotData) {
  if (processNode.value === ProcessNode.DTP) {
    recordActive.value = RecordType[1];
  } else if (processNode.value === ProcessNode.TEP) {
    recordActive.value = RecordType[0];
  }
  dotAddTempValue.value = data;
}

// 详情展示
const onPosition = function (id: string | number) {
  const image = previewRef.value;
  if (image && image.setPosition) {
    const list = dots.value.results;
    const data = _.find(list, function (item: DotData) {
      return item.id === id;
    });
    if (data) {
      image.setPosition(data.xCorrdinate1 || 0, data.yCorrdinate1 || 0);
      dotAddTempValue.value = data;
    }
  }
}

const onCancelDot = function () {
  dotAddTempValue.value = void 0;
}


const onChangeTabValue = function () {
  onUpDataDots();
}

</script>

<template>
  <Layout class="!p-0 h-screen">
    <LayoutHeader class="p-2 h-[initial] leading-[initial] bg-white flex items-center justify-between">
      <TaskTitle :task-id="route.params.taskId">
        <span>[{{ filterSuccess(state.results).length }} / {{ state.total }}]</span>
      </TaskTitle>
      <Space>
        <Button type="primary">提交</Button>
        <Button type="primary" danger>返回</Button>
      </Space>
    </LayoutHeader>
    <LayoutContent class="border-t border-gray border-solid">
      <Layout class="h-full">
        <LayoutContent class="border-r border-gray border-solid bg-white">
          <Preview v-if="currentFile"
                   ref="previewRef"
                   class="h-full"
                   :disabled="!!dotAddTempValue"
                   :data="currentFile"
                   :dots="dots.results"
                   :key="currentFile.id"
                   @dot="onChangeDot">
            <template #operate>
              <Switch :current="currentFile" :list="state.results"></Switch>
            </template>
          </Preview>
        </LayoutContent>
        <LayoutSider class="!w-80 !max-w-80 !flex-auto bg-[#fff]">
          <div class="p-2">
            <Tab v-model:value="recordActive" :list="RecordType" @change="onChangeTabValue"
                 :disabled="!!dotAddTempValue"></Tab>
          </div>
          <template v-if="!!dotAddTempValue">
            <template v-if="processNode === ProcessNode.TEP">
              <RegisterWord
                  :data="dotAddTempValue"
                  :file="currentFile"
                  @save="onUpDataDots"
                  @cancel="onCancelDot"></RegisterWord>
            </template>
            <template v-else-if="processNode === ProcessNode.DTP">
              <RegisterComment
                  :data="dotAddTempValue"
                  :file="currentFile"
                  @save="onUpDataDots"
                  @cancel="onCancelDot"></RegisterComment>
            </template>
          </template>
          <template v-else>
            <Record @position="onPosition" :active="recordActive" :key="recordActive" :list="dots.results"></Record>
          </template>
        </LayoutSider>
      </Layout>
    </LayoutContent>
  </Layout>
</template>

