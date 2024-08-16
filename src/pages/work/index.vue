<script setup lang="ts">
/**
 * @file 图片相关操作
 * @author svon.me@gmail.com
 */

import api from "src/api";

import {ref} from "vue";
import * as alias from "src/router/alias";
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
import {filterSuccess, pickImage} from "./config";
import {DotDataType} from "src/components/preview/config";
import Loading from "src/components/loading/index.vue";

import {Button, Layout, LayoutContent, LayoutHeader, LayoutSider, Space} from "ant-design-vue";

import type {ImageData, TaskData} from "src/types";
import type {DotData} from "src/components/preview/config";

const previewRef = ref();
const route = useRoute();
const recordActive = ref<string>();
const recordTabs = ref<string[]>([]);
const dotAddTempValue = ref<DotData>();


const currentFile = ref<ImageData>();
// 任务明细列表
const {state, execute: _reloadList} = model.list<ImageData>(async function () {
  const res = await api.work.getImages<ImageData>(route.params.taskId as string);
  if (res.total > 0) {
    currentFile.value = pickImage(res.results, route.params.workId as string);
    setTimeout(onUpDataDots);
  }
  return res;
}, new model.PageResult<ImageData>(), true);

// 记录点
const {state: dots, execute: _reloadDots, isLoading} = model.list<DotData>(function () {
  if (recordActive.value === RecordType[0] && currentFile.value) {
    return api.work.getDotList<DotData>(currentFile.value.id);
  }
  return new model.PageResult<DotData>();
}, new model.PageResult<DotData>(), false);

const onReloadList = function () {
  _reloadList(100);
}

const onUpDataDots = function () {
  _reloadDots(100);
  dotAddTempValue.value = void 0;
}

// 打点（描点）
const onChangeDot = function (data: DotData) {
  dotAddTempValue.value = data;
  if (data.coordinateType === DotDataType.Comment) {
    recordActive.value = RecordType[1];
  } else {
    recordActive.value = RecordType[0];
  }
}

// 查看标记位置
const onViewLocation = function (id: string | number) {
  const image = previewRef.value;
  if (image && image.setBoxScroll) {
    const data = pickImage<DotData>(dots.value.results, id)
    if (data) {
      image.setBoxScroll(data);
    }
  }
}
// 编辑标记数据
const onEditLocation = function (id: string | number) {
  const image = previewRef.value;
  if (image && image.setBoxDot) {
    const data = pickImage<DotData>(dots.value.results, id)
    if (data) {
      image.setBoxDot(data);
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

const onSubmit = function (task: TaskData) {
  console.log(task);
}

</script>

<template>
  <Layout class="!p-0 h-screen">
    <LayoutHeader class="p-2 h-[initial] leading-[initial] bg-white">
      <TaskTitle :task-id="route.params.taskId">
        <span>[{{ filterSuccess(state.results).length }} / {{ state.total }}]</span>
        <!-- 右侧操作按钮 -->
        <template #operate="{ task }">
          <Space>
            <template v-if="state.total > 0 && filterSuccess(state.results).length===state.total">
              <Button type="primary" @click="onSubmit(task)">提交</Button>
            </template>
            <template v-else>
              <Button type="primary" :disabled="true">提交</Button>
            </template>
            <router-link :to="{ name: alias.TaskDetails.name, params: { versionId: task.versionId, taskId: task.id } }">
              <Button>返回</Button>
            </router-link>
          </Space>
        </template>
      </TaskTitle>
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
        <LayoutSider class="!w-80 !max-w-80 !flex-auto bg-white overflow-y-auto">
          <Loading class="h-full p-2" :status="isLoading">
            <Tab class="mb-2" v-model:value="recordActive" :list="recordTabs" @change="onChangeTabValue"
                 :disabled="!!dotAddTempValue"></Tab>
            <template v-if="dotAddTempValue">
              <RegisterComment v-if="dotAddTempValue.coordinateType === DotDataType.Comment"
                               :data="dotAddTempValue"
                               :file="currentFile"
                               @save="onUpDataDots"
                               @cancel="onCancelDot"></RegisterComment>
              <RegisterWord v-else
                            :data="dotAddTempValue"
                            :file="currentFile"
                            @save="onUpDataDots"
                            @cancel="onCancelDot"></RegisterWord>
            </template>
            <template v-else>
              <Record
                  @view="onViewLocation"
                  @edit="onEditLocation"
                  @success="onReloadList"
                  :work-id="route.params.workId"
                  :active="recordActive"
                  :key="recordActive"
                  :list="dots.results"></Record>
            </template>
          </Loading>
        </LayoutSider>
      </Layout>
    </LayoutContent>
  </Layout>
</template>

