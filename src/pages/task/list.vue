<script setup lang="ts">
/**
 * @file 任务列表
 */
import api from "src/api";
import * as model from "src/utils/model";
import {ref} from 'vue';

import {onCreate, columns} from "./config";
import * as alias from "src/router/alias";
import {RouterLink, useRoute} from "vue-router";
import {Table, Button, Card, Form, FormItem, Input, Space, Progress, Breadcrumb, BreadcrumbItem} from "ant-design-vue";


const route = useRoute();
const versionId: number = route.params.versionId as any;

const taskStatus = ref([]);


const initStatus = async () => {
  try {
    taskStatus.value = await api.system.getDictData('comic_task_status')
  } catch (error) {
    console.error("Failed to fetch language:", error);
  }
};
initStatus()
// 初始化集合
const {state, execute: onLoad, isLoading} = model.list<object>(function () {
    return api.task.list(1, versionId);
  },
  new model.PageResult<object>([]),
  true
);


const searchInfo = ()=>{
  onLoad(100)
}
const onCreateTask = async function () {
  console.log(versionId);
  const res = await onCreate(versionId);
  console.log(res);
  if (res) {
    await onLoad(100); // 100 毫秒后刷新列表
  }
}
//状态映射
const changeStatus = function (dict: String) {
  console.log(dict);
  console.log(taskStatus.value);
  
  for (const element of taskStatus.value) {
    if (dict === element.dictValue) {
      return element.dictLabel;
    }
  }
  return '-';
}


//进度计算
const changeProcess = function (doneCount: number, allCount: number) {
  return (doneCount / allCount) * 100;
}
</script>

<template>
  <div>
    <Breadcrumb v-if="versionId">
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem>
        <RouterLink :to="{ name: alias.ProjectDetails.name, params:{ projectId: route.params.projectId } }">
          <a href="">项目中心</a>
        </RouterLink>
      </BreadcrumbItem>
      <BreadcrumbItem>任务列表</BreadcrumbItem>

    </Breadcrumb>
    <br/>
    
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
         
          <Space>
            <Button type="primary" @click="searchInfo">搜索</Button>
            <Button>重置</Button>
          </Space>
        </FormItem>
      </Form>
    

    <Card class="mt-5 h-15">
      <Space size="large" class="ml-5 mt-2">
        <Button @click="onCreateTask" type="primary">新建任务</Button>
        <Button>生成交付文件</Button>
        <Button>归档</Button>
      </Space>
    </Card>

    <Card class="mt-5">
      <Table :data-source="state.results" :columns="columns" :bordered="true" :loading="isLoading">
        <template #bodyCell="{ column, text, record  }">
          <template v-if="column.key === 'taskName'">
            <RouterLink
                :to="{ name: alias.TaskDetails.name, params:{ versionId: record.versionId, taskId: record.id } }">
              <Button type="link">{{ text }}</Button>
            </RouterLink>
          </template>
          <template v-else-if="column.key === 'taskStatus'">
            <span>{{ changeStatus(record.taskStatus) }}</span>
          </template>
        
          <template v-else-if="column.key === 'doneCnt'">
            <Progress :percent="changeProcess(record.doneCnt,record.totalCnt)" status="active" :showInfo="true"
                      :format="percent => `${record.doneCnt} /${record.totalCnt}`"/>
          </template>
        </template>
      </Table>
    </Card>
  </div>
</template>