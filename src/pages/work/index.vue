<script setup lang="ts">
/**
 * @file 图片相关操作
 * @author svon.me@gmail.com
 */

import api from "src/api";

import {ref} from "vue";
import * as alias from "src/router/alias";
import {useRoute, useRouter} from "vue-router";
import Record from "./record/index.vue";
import * as model from "src/utils/model";
import {RecordType} from "./record/config";
import Preview from "src/components/preview/index.vue";
import RegisterWord from "./register/word.vue";
import RegisterComment from "./register/comment.vue";
import Tab from "src/components/tab/index.vue";
import Switch from "./switch.vue";
import TaskTitle from "src/components/task/title.vue";
import {filterSuccess, pickImage, RecordTabs} from "./config";
import {DotDataType} from "src/components/preview/config";
import Loading from "src/components/loading/index.vue";
import {TaskStatus} from "src/types";
import {Button, Layout, LayoutContent, LayoutHeader, LayoutSider, Space} from "ant-design-vue";

import type {ImageData, TaskData, Project} from "src/types";
import type {DotData} from "src/components/preview/config";

const previewRef = ref();
const route = useRoute();
const router = useRouter();
const recordActive = ref<string>();
const recordTabs = ref<string[]>([]);
const dotAddTempValue = ref<DotData>();


const currentFile = ref<ImageData>();
// 任务详情
const {state: projectInfo} = model.result<Project>(() => {
  return api.project.getProjectInfoByTId(route.params.taskId as string);
}, {} as Project, true);

// 任务详情
const {state: taskInfo} = model.result<TaskData>(async () => {
  const data = await api.task.getTaskInfoById(route.params.taskId as string);
  if (data && data.taskStatus && TaskStatus.CHECK.includes(String(data.taskStatus))) {
    recordTabs.value = [...RecordTabs];
  } else {
    recordTabs.value = [RecordTabs[0]];
  }
  recordActive.value = recordTabs.value[0];
  return data;
}, void 0, true);

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
  if (currentFile.value) {
    if (recordActive.value === RecordType[1]) {
      return api.work.getDotList<DotData>(currentFile.value.id, DotDataType.Comment);
    }
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

const backOption = function (task: TaskData) {
  return {
    name: alias.TaskDetails.name,
    params: {
      versionId: task.versionId, taskId: task.id
    }
  }
}

const onSubmit = async function () {
  const data = {
    id: taskInfo.value.id,
    taskStatus: taskInfo.value.taskStatus,
    projectNum: projectInfo.value.projectNum,
    projectId: projectInfo.value.id,
    // 非必传
    taskName: taskInfo.value.taskName,
    taskOrder: taskInfo.value.taskOrder,
    sourceLanguage: taskInfo.value.sourceLanguage,
    targetLanguage: taskInfo.value.targetLanguage,
    versionId: taskInfo.value.versionId,
    versionName: taskInfo.value.versionName,
  };
  const status = await api.work.onSubmit(data);
  if (status) {
    const value = backOption(taskInfo.value);
    await router.replace(value);
  }
}

</script>

<template>
  <Layout class="!p-0 h-screen">
    <LayoutHeader class="p-2 h-[initial] leading-[initial] bg-white min-h-12">
      <TaskTitle v-if="taskInfo && taskInfo.id" :task-id="taskInfo.id" :data="taskInfo">
        <span>[{{ filterSuccess(state.results).length }} / {{ state.total }}]</span>
        <!-- 右侧操作按钮 -->
        <template #operate="{ task }">
          <Space>
            <template v-if="state.total > 0 && filterSuccess(state.results).length===state.total">
              <Button type="primary" @click="onSubmit">提交</Button>
            </template>
            <template v-else>
              <Button type="primary" :disabled="true">提交</Button>
            </template>
            <router-link :to="backOption(task)" :replace="true">
              <Button>返回</Button>
            </router-link>
          </Space>
        </template>
      </TaskTitle>
    </LayoutHeader>
    <LayoutContent class="border-t border-gray border-solid">
      <Layout class="h-full">
        <LayoutContent class="border-r border-gray border-solid bg-white">
          <Preview v-if="currentFile && projectInfo.readOrder"
                   ref="previewRef"
                   class="h-full"
                   :disabled="!!dotAddTempValue"
                   :data="currentFile"
                   :dots="dots.results"
                   :key="currentFile.id"
                   :read-order="projectInfo.readOrder"
                   @dot="onChangeDot">
            <template #operate>
              <Switch :current="currentFile" :list="state.results"></Switch>
            </template>
          </Preview>
        </LayoutContent>
        <LayoutSider class="!w-120 !max-w-120 !flex-auto bg-white overflow-y-auto">
          <Loading class="h-full p-2" :status="isLoading">
            <Tab class="mb-2" v-model:value="recordActive" :list="recordTabs" @change="onChangeTabValue"
                 :disabled="!!dotAddTempValue"></Tab>
            <template v-if="dotAddTempValue && taskInfo.projectId">
              <RegisterComment v-if="dotAddTempValue.coordinateType === DotDataType.Comment"
                               :data="dotAddTempValue"
                               :file="currentFile"
                               :projectId="taskInfo.projectId"
                               @save="onUpDataDots"
                               @cancel="onCancelDot"></RegisterComment>
              <RegisterWord v-else
                            :data="dotAddTempValue"
                            :file="currentFile"
                            @save="onUpDataDots"
                            @cancel="onCancelDot"></RegisterWord>
            </template>
            <template v-else-if="taskInfo && taskInfo.projectId">
              <Record
                  @view="onViewLocation"
                  @edit="onEditLocation"
                  @success="onReloadList"
                  :work-id="route.params.workId"
                  :active="recordActive"
                  :projectId="taskInfo.projectId"
                  :key="recordActive"
                  :list="dots.results"></Record>
            </template>
          </Loading>
        </LayoutSider>
      </Layout>
    </LayoutContent>
  </Layout>
</template>

