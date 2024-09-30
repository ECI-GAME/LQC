<script setup lang="ts">
/**
 * @file 任务明细
 * @author svon.me@gmail.com
 */

import api from "src/api";
import {Icon} from "@ue/icon";
import * as model from "src/utils/model";
import * as alias from "src/router/alias";
import safeGet from "@fengqiaogang/safe-get";
import * as work from "src/utils/work/common";
import Dict from "src/components/dict/index.vue";
import TaskTitle from "src/components/task/title.vue";
import ImageDownload from "src/pages/image/download.vue";
import TaskLog from "src/components/task/log/button.vue";
import {Table, Button, Card, Space} from "ant-design-vue";
import {RouterLink, useRoute, useRouter} from "vue-router";

import type {TaskData} from "src/types/task";

const route = useRoute();
const router = useRouter();

const {state: stateData, isReady} = model.result<TaskData>(() => {
  return api.task.getTaskInfoById(route.params.taskId as string);
}, {} as TaskData, true);

const {state, execute: onLoad, isLoading} = model.list<object>(
  // 执行逻辑
  function () {
    const taskId = route.params.taskId as string;
    return api.task.getTaskInfoDetailById(taskId);
  },
  // 默认值，为空时自动创建
  new model.PageResult<object>([]),
  // 是否默认执行，默认为 false
  true
);

const taskFinishList = [
  {dictValue: 0, dictLabel: "未完成"},
  {dictValue: 1, dictLabel: "已完成"},
];

const columns = [
  {title: "图片名称", dataIndex: 'imageName', key: 'imageName'},
  {title: "状态", dataIndex: 'imageStatus', key: 'imageStatus', align: "center"},
  {title: "处理人", dataIndex: 'handlerName', key: 'handlerName', align: "center"},
  {title: "是否已完成", dataIndex: 'isFinish', key: 'isFinish', align: "center"},
  {title: "最近处理时间", dataIndex: 'dealTime', key: 'dealTime', align: "center"},
  {title: "操作", dataIndex: 'imageId', key: 'action', align: "center", width: 180},
];

const getKnowledgeUrl = function () {
  const url = {
    name: alias.Knowledge.name,
    params: {
      projectId: stateData.value.projectId,
    },
    query: {
      versionId: stateData.value.versionId
    }
  };
  const page = router.resolve(url);
  return page.fullPath;
}

// 文本导出
const onDownloadText = function () {
  work.onDownloadText(route.params.taskId as string);
}

// 保存，设置完成状态
const onSave = function (data: object) {
  const workId = safeGet<string>(data, "id");
  work.onSave(workId, () => onLoad(150));
}
</script>

<template>
  <div>
    <Card>
      <div class="flex items-center justify-between">
        <TaskTitle v-if="isReady" :task-id="route.params.taskId" :data="stateData"/>
        <Space size="large">
          <Button type="primary" @click="onDownloadText" class="bg-neutral-600">文本导出</Button>
          <TaskLog :task-id="route.params.taskId"></TaskLog>
          <a v-if="isReady" :href="getKnowledgeUrl()" target="_blank">
            <Button>知识库</Button>
          </a>
          <!--          <Button type="primary">提交</Button>-->
        </Space>
      </div>
    </Card>
    <Card class="mt-5">
      <Table :data-source="state.results" :columns="columns" :bordered="true" :pagination="false">
        <template #bodyCell="{ column, text, record  }">
          <template v-if="column.key === 'imageName'">
            <RouterLink :to="{ name: alias.Work.name, params:{ workId: record.id, taskId: route.params.taskId } }">
              <Button type="link">{{ text }}</Button>
            </RouterLink>
          </template>
          <!--状态-->
          <Dict v-else-if="column.key === 'imageStatus'" :value="text" type="comic_task_status"></Dict>
          <!--是否已完成-->
          <Dict v-else-if="column.key === 'isFinish'" :value="text" :options="taskFinishList"></Dict>
          <template v-else-if="column.key === 'action'">
            <Space>
              <!--图片预览下载-->
              <ImageDownload class="flex" :icon="true" :id="text" :value="text" :type="record.imageStatus"/>
              <!--设置完成状态-->
              <div class="flex">
                <Button type="primary" size="small" @click="onSave(record)">
                  <Space :size="4">
                    <Icon class="text-base flex" type="save"></Icon>
                    <span>已完成</span>
                  </Space>
                </Button>
              </div>
            </Space>
          </template>
        </template>
      </Table>
    </Card>
  </div>
</template>