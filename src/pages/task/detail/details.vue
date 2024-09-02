<script setup lang="ts">
/**
 * @file 任务明细
 */
import api from "src/api";
import {Icon} from "@ue/icon";
import * as model from "src/utils/model";
import * as alias from "src/router/alias";
import {RouterLink, useRoute, useRouter} from "vue-router";
import TaskTitle from "src/components/task/title.vue";
import TaskLog from "src/components/task/log/button.vue";
import {Checkbox, Table, Button, Card, Space} from "ant-design-vue";

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


const {state: taskStatus} = model.list<object>(() => {
    return api.system.getDictData('comic_task_status');
  },
  // 默认值，为空时自动创建
  new model.PageResult<object>([]),
  // 是否默认执行，默认为 false
  true
);


//状态映射
const changeStatus = function (dict: string) {
  const res = taskStatus.value;
  for (const element of res.results) {
    if (dict === element.dictValue) {
      return element.dictLabel;
    }
  }
  return '-';
}


const columns = [
  {title: "图片名称", dataIndex: 'imageName', key: 'imageName'},
  {title: "状态", dataIndex: 'imageStatus', key: 'imageStatus', align: "center"},
  {title: "处理人", dataIndex: 'handlerName', key: 'handlerName', align: "center"},
  {title: "是否已完成", dataIndex: 'isFinish', key: 'isFinish', align: "center"},
  {title: "最近处理时间", dataIndex: 'dealTime', key: 'dealTime', align: "center"},
  {title: "操作", dataIndex: 'fileId', key: 'action', align: "center"},
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

</script>

<template>
  <div>
    <Card>
      <div class="flex items-center justify-between">
        <TaskTitle v-if="isReady" :task-id="route.params.taskId" :data="stateData"/>
        <Space size="large">
          <TaskLog :task-id="route.params.taskId"></TaskLog>
          <a v-if="isReady" :href="getKnowledgeUrl()" target="_blank">
            <Button>知识库</Button>
          </a>
          <Button type="primary">提交</Button>
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
          <template v-else-if="column.key === 'imageStatus'">
            <span>{{ changeStatus(record.imageStatus) }}</span>
          </template>

          <template v-else-if="column.key === 'isFinish'">
            <Checkbox :checked="record.isFinish==1">已完成</Checkbox>
          </template>
          <template v-else-if="column.key === 'action'">
            <span class="inline-block">
              <Icon class="text-xl text-primary cursor-pointer" type="download"></Icon> 
            </span>
          </template>
        </template>
      </Table>
    </Card>
  </div>
</template>