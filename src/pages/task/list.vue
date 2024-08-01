<script setup lang="ts">
/**
 * @file 任务列表
 */
 import api from "src/api";
 import * as model from "src/utils/model";
 import { ref, onMounted } from 'vue';

import {Icon} from "@ue/icon";
import {onCreate} from "./config";
import * as alias from "src/router/alias";
import {RouterLink, useRoute} from "vue-router";
import {Table, Button, Card, Form, FormItem, Input, Space,Progress} from "ant-design-vue";


const route = useRoute();


const versionId = route.params.versionId;


console.log('Project ID = "%s"', route.params.versionId);

const taskStatus = ref([]);
const fetchTaskInfo = async () => {
  try {
    taskStatus.value = await api.system.getDictData('comic_task_status');
  } catch (error) {
    console.error("Failed to fetch task status:", error);
  }
};

fetchTaskInfo()

const columns = [
  {title: "任务名称", dataIndex: 'taskName', key: 'taskName'},
  {title: "状态", dataIndex: 'taskStatus', key: 'taskStatus', align: "center"},
  {title: "处理人", dataIndex: 'handlerName', key: 'handlerName', align: "center"},
  {title: "创建时间", dataIndex: 'createTime', key: 'createTime', align: "center"},
  {title: "更新时间", dataIndex: 'lastDealTime', key: 'lastDealTime', align: "center"},
  {title: "进度", dataIndex: 'totalCnt', key: 'totalCnt', align: "center"},
  {title: "操作", dataIndex: 'id', key: 'action', align: "right"},
];

// 初始化集合
const {state, execute: onLoad, isLoading} = model.list<object>(
  function () {
    return api.task.list(1,versionId);
  },
  new model.PageResult<object>([]),
  true
);


const onCreateTask = async function () {

  const res = await onCreate(versionId);
  console.log(res);
  if (res) {
    await onLoad(100); // 100 毫秒后刷新列表
  }
}
//状态映射
const changeStatus = function(dict: String){
  for (const element of taskStatus.value) {
    if (dict === element.dictValue) {
      return element.dictLabel;
    }
  }
  return '-';
}

//进度计算
const changeProcess = function(doneCount: number,allCount: number){
  return (doneCount/allCount)*100;
}
</script>

<template>
  <div>
    <Card>
      <Form layout="inline">
        <FormItem label="任务名称">
          <Input/>
        </FormItem>
        <FormItem label="状态">
          <Input/>
        </FormItem>
        <FormItem label="处理人">
          <Input/>
        </FormItem>
        <FormItem>
          <template #label></template>
          <Space>
            <Button>搜索</Button>
            <Button>重置</Button>
          </Space>
        </FormItem>
      </Form>
    </Card>

    <Card class="mt-5">
      <Space size="large">
        <Button @click="onCreateTask">新建任务</Button>
        <Button>生成交付文件</Button>
        <Button>归档</Button>
      </Space>
    </Card>

    <Card class="mt-5">
      <Table :data-source="state.results" :columns="columns" :bordered="true"  :loading="isLoading">
        <template #bodyCell="{ column, text, record  }">
          <template v-if="column.key === 'taskName'">
            <RouterLink :to="{ name: alias.TaskDetails.name, params:{ versionId: record.versionId, taskId: record.id } }">
              <Button type="link">{{ text }}</Button>
            </RouterLink>
          </template>
          <template v-else-if="column.key === 'taskStatus'" >
            <span>{{changeStatus(record.taskStatus)}}</span>
          </template>
          <template v-else-if="column.key === 'image'">
            <Button v-if="text" type="link">预览</Button>
            <span v-else>待生成</span>
          </template>
          <template v-else-if="column.key === 'image'">
            <Button v-if="text" type="link">预览</Button>
            <span v-else>待生成</span>
          </template>
          <template v-else-if="column.key === 'totalCnt'">
            <Progress :percent="changeProcess(record.doneCnt,record.totalCnt)" status="active" :showInfo="true" :format="percent => `${record.doneCnt} /${record.totalCnt}`" />
          </template>
        </template>
      </Table>
    </Card>
  </div>
</template>