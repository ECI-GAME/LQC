<script setup lang="ts">
/**
 * @file 图片相关操作
 * @author svon.me@gmail.com
 */

import {ref} from "vue";
import api from "src/api";
import Switch from "./switch.vue";
import BigNumber from "bignumber.js";
import {TaskStatus} from "src/types";
import Record from "./record/index.vue";
import * as model from "src/utils/model";
import * as alias from "src/router/alias";
import {useRoute, useRouter} from "vue-router";
import RegisterWord from "./register/word.vue";
import Tab from "src/components/tab/index.vue";
import * as work from "src/utils/work/common";
import RegisterComment from "./register/comment.vue";
import Screen from "src/components/screen/index.vue";
import Preview from "src/components/preview/index.vue";
import TaskTitle from "src/components/task/title.vue";
import Loading from "src/components/loading/index.vue";
import TaskLog from "src/components/task/log/button.vue";
import {filterSuccess, pickImage, RecordTabType} from "./config";
import {DotDataType, DotData} from "src/components/preview/config";
import {Button, Layout, LayoutContent, LayoutHeader, LayoutSider, Space, Card, Empty} from "ant-design-vue";

import type {ImageData, TaskData, Project} from "src/types";


const previewRef = ref();
const route = useRoute();
const router = useRouter();
const recordActive = ref<string>();
const recordTabs = ref<string[]>([RecordTabType.Word, RecordTabType.Comment]);
const dotAddTempValue = ref<DotData>();


const currentFile = ref<ImageData>();
// 任务详情
const {state: projectInfo} = model.result<Project>(() => {
  return api.project.getProjectInfoByTId(route.params.taskId as string);
}, {} as Project, true);

// 任务详情
const {state: taskInfo} = model.result<TaskData>(async () => {
  const data = await api.task.getTaskInfoById(route.params.taskId as string);
  if (data && data.taskStatus) {
    if (TaskStatus.RUN.includes(String(data.taskStatus))) {
      recordTabs.value = [RecordTabType.Word];
    }
  }
  recordActive.value = recordTabs.value[0];
  return data;
}, void 0, true);

// 任务明细列表
const {state, execute: _reloadList} = model.list<ImageData>(async function () {
  const res = await api.work.getImages<ImageData>(route.params.taskId as string);
  if (res.total > 0) {
    if (route.params.workId) {
      currentFile.value = pickImage(res.results, route.params.workId as string);
    } else {
      currentFile.value = res.results[0];
    }
    setTimeout(onUpDataDots);
  }
  return res;
}, new model.PageResult<ImageData>(), true);

// 记录点
const {state: dots, execute: _reloadDots, isLoading} = model.list<DotData>(function () {
  if (currentFile.value) {
    // 判断当前展示的是否为批注数据
    if (recordActive.value === RecordTabType.Comment) {
      return api.work.getDotList<DotData>(currentFile.value.imageId, DotDataType.Comment);
    }
    return api.work.getDotList<DotData>(currentFile.value.imageId);
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

const onChangeTabValue = function () {
  onUpDataDots();
}

const getKnowledgeUrl = function () {
  const url = {
    name: alias.Knowledge.name,
    params: {
      projectId: taskInfo.value.projectId,
    },
    query: {
      versionId: taskInfo.value.versionId
    }
  };
  const page = router.resolve(url);
  if (page && page.fullPath) {
    return page.fullPath;
  }
  return "javascript:;";
}

// 打点（描点）
const onChangeDot = async function (data: DotData) {
  if (recordActive.value === RecordTabType.Comment) {
    data.coordinateType = DotDataType.Comment;
  } else {
    data.coordinateType = DotDataType.Ocr;
  }
  dotAddTempValue.value = data;
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
    // 必传
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

// 文本导出
const onDownloadText = function () {
  work.onSave(route.params.taskId as string);
}

const onClickImage = function (e: Event, data: { x: number, y: number, width: number, height: number }) {
  dotAddTempValue.value = new DotData(
    data.x,
    data.y,
    data.x,
    data.y,
    data.width,
    data.height
  );
}

const calcDotValue = function (data: DotData): DotData {
  if (data.id) {
    return data;
  }
  const preview = previewRef.value;
  const scroll = preview.scrollValue();
  return new DotData(
    Number(new BigNumber(data.xCorrdinate1).plus(scroll.left).div(scroll.scale).toFixed(2)),
    Number(new BigNumber(data.yCorrdinate1).plus(scroll.top).div(scroll.scale).toFixed(2)),
    Number(new BigNumber(data.xCorrdinate2).plus(scroll.left).div(scroll.scale).toFixed(2)),
    Number(new BigNumber(data.yCorrdinate2).plus(scroll.top).div(scroll.scale).toFixed(2)),
    data.imageWidth,
    data.imageHeight,
  );
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
            <Button @click="onDownloadText">文本导出</Button>
            <!--操作记录-->
            <TaskLog :task-id="taskInfo.id"></TaskLog>
            <a :href="getKnowledgeUrl()" target="_blank">
              <Button>知识库</Button>
            </a>
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
                   @click="onClickImage">
            <template #operate>
              <Switch :current="currentFile" :list="state.results"></Switch>
            </template>
            <template #extend="scope">
              <Screen v-if="dotAddTempValue && !dotAddTempValue.id"
                      v-model:x1="dotAddTempValue.xCorrdinate1"
                      v-model:y1="dotAddTempValue.yCorrdinate1"
                      v-model:x2="dotAddTempValue.xCorrdinate2"
                      v-model:y2="dotAddTempValue.yCorrdinate2"/>
            </template>
          </Preview>
        </LayoutContent>
        <LayoutSider class="!w-120 !max-w-120 !flex-auto bg-white overflow-y-auto">
          <Loading class="h-full p-2" :status="isLoading">
            <Tab class="mb-2" v-model:value="recordActive" :list="recordTabs" @change="onChangeTabValue"
                 :disabled="!!dotAddTempValue"></Tab>
            <!-- 标记数量大于0或者正在创建标记点数据 -->
            <template v-if="dotAddTempValue || dots.total > 0">
              <Record v-if="currentFile && taskInfo && taskInfo.projectId"
                      @view="onViewLocation"
                      @edit="onEditLocation"
                      @success="onReloadList"
                      :work-id="currentFile.id"
                      :active="recordActive"
                      :projectId="taskInfo.projectId"
                      :key="recordActive"
                      :list="dots.results"
                      :image-status="currentFile.imageStatus">
                <Card v-if="dotAddTempValue" class="mt-2 shadow-2xl border-primary sticky bottom-2" size="small">
                  <RegisterComment v-if="recordActive === RecordTabType.Comment"
                                   :data="dotAddTempValue"
                                   :file="currentFile"
                                   :projectId="taskInfo.projectId"
                                   @save="onUpDataDots"
                                   @cancel="onCancelDot"></RegisterComment>
                  <RegisterWord v-else-if="currentFile"
                                :data="calcDotValue(dotAddTempValue)"
                                :file="currentFile"
                                :language = "taskInfo.sourceLanguage"
                                :projectId="taskInfo.projectId"
                                :read-order="projectInfo.readOrder"
                                @save="onUpDataDots"
                                @cancel="onCancelDot"></RegisterWord>
                </Card>
              </Record>
            </template>
            <!-- 提示数据为空 -->
            <Card v-else class="py-10" size="small">
              <Empty></Empty>
            </Card>
          </Loading>
        </LayoutSider>
      </Layout>
    </LayoutContent>
  </Layout>
</template>

