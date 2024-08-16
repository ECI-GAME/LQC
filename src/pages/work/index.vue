<script setup lang="ts">
/**
 * @file 图片相关操作
 * @author svon.me@gmail.com
 */

import api from "src/api";
import List from "./list.vue";
import * as _ from "lodash-es";
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import Record from "./record/index.vue";
import * as model from "src/utils/model";
import {RecordType} from "./record/config";
import Preview from "src/components/preview/index.vue";
import RegisterWord from "./register/word.vue";
import RegisterComment from "./register/comment.vue";
import safeGet from "@fengqiaogang/safe-get";
import Tab from "src/components/tab/index.vue";
import {ProcessNode} from "./config";
import {Layout, LayoutContent, LayoutHeader, LayoutSider} from "ant-design-vue";

import type {DotData} from "src/components/preview/config";

const previewRef = ref();
const projectInfo = ref({});
const route = useRoute();
const recordActive = ref<string>(RecordType[0]);
const dotAddTempValue = ref<DotData>();
const processNode = ref<ProcessNode>();
  const taskId = ref<string>(route.params.taskId as string);
const initProject = async function (){
  projectInfo.value = await api.project.getProjectInfoByTId(taskId.value)
}

initProject()

onMounted(function () {
  const id = String(route.params.workId);
  if (id === "26") {
    processNode.value = ProcessNode.DTP;
  } else {
    processNode.value = ProcessNode.TEP;
  }
});

const workId = ref<string>(route.params.workId as string);

// 任务明细列表
const {state} = model.list<object>(function () {
  return api.task.getTaskFiles(route.params.taskId as string);
}, new model.PageResult<object>(), true);


// 记录点
const {state: dots, execute: onReloadDots, isLoading} = model.list<DotData>(function () {
  if (recordActive.value === RecordType[0]) {
    return api.work.getDotList<DotData>(workId.value);
  }
  return new model.PageResult<DotData>();
}, new model.PageResult<DotData>(), true);

const onUpDataDots = function () {
  onReloadDots(100);
  dotAddTempValue.value = void 0;
}

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
               :dots="dots.results" :disabled="!!dotAddTempValue"
               :readOrder="projectInfo.readOrder"
               :key="workId"
               @dot="onChangeDot"></Preview>
    </LayoutContent>
    <LayoutSider class="!w-80 !max-w-80 !flex-auto bg-[#fff]">
      <Layout class="h-full">
        <LayoutHeader class="bg-white h-[initial] leading-[initial] p-2 border-b border-solid border-slate-300">
          <Tab v-model:value="recordActive" :list="RecordType" @change="onChangeTabValue"
               :disabled="!!dotAddTempValue"></Tab>
        </LayoutHeader>
        <LayoutContent class="p-2 overflow-y-auto">
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
        </LayoutContent>
      </Layout>
    </LayoutSider>
  </Layout>
</template>

