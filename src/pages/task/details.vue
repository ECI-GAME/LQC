<script setup lang="ts">
/**
 * @file 任务明细
 */
import { ref, onMounted } from 'vue';
import api from "src/api";
import {Icon} from "@ue/icon";
import * as model from "src/utils/model";

import {RouterLink, useRoute} from "vue-router";
import * as alias from "src/router/alias";
import {Table, Button, Card, Space,Breadcrumb,BreadcrumbItem,Row,Col} from "ant-design-vue";
import {DownloadOutlined} from "ant-design-vue"

const route = useRoute();
const taskId = route.params.taskId;
const versionId = route.params.versionId;
const taskInfo = ref({});
const taskStatus = ref([]);
onMounted(async () => {
  taskInfo.value = await api.task.getTaskInfoById(taskId);
  console.log(taskInfo.value);
});
const {state, execute: onLoad, isLoading} = model.list<object>(
  // 执行逻辑
  function () {
    return api.task.getTaskInfoDetailById(taskId);
  },
  // 默认值，为空时自动创建
  new model.PageResult<object>([]),
  // 是否默认执行，默认为 false
  
  true
);

const fetchTaskInfo = async () => {
  try {
    taskStatus.value = await api.system.getDictData('comic_task_status');
  } catch (error) {
    console.error("Failed to fetch task status:", error);
  }
};
fetchTaskInfo()
//状态映射
const changeStatus = function(dict){
  for (const element of taskStatus.value) {
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
  {title: "是否已完成", dataIndex: 'upstreamNode', key: 'upstreamNode', align: "center"},
  {title: "最近处理时间", dataIndex: 'dealTime', key: 'dealTime', align: "center"},
  {title: "操作", dataIndex: 'fileId', key: 'action', align: "center"},
];



</script>

<template>
  
  <div>
    
    <Breadcrumb>
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem><a href="">任务列表</a></BreadcrumbItem>
      <BreadcrumbItem>任务明细</BreadcrumbItem>
    </Breadcrumb>
  
    <Card>
      <Row :gutter="16">
      <Col class="gutter-row" :span="10">
        <div class="gutter-box text-base">
            <label class="text-black">{{taskInfo.taskName}}</label>
            [<label class="text-red-600">{{taskInfo.estimatedStartDate}}-{{taskInfo.estimatedEndDate}}</label>]
            [<label class="text-blue-600">{{ taskInfo.sourceLanguage }}->{{ taskInfo.targetLanguage }}</label>]
            [<label class="text-green-600">{{ taskInfo.handlerName }}</label>]
          </div>
      </Col>
      
      <Col class="gutter-row" :span="8">
        
      </Col>
      <Col class="gutter-row" :span="6">
        <Space size="large">
        <Button  type="default">操作记录</Button>
        <Button>知识库</Button>
        <Button type="primary">提交</Button>
      </Space>
      </Col>
    </Row>
     
    </Card>

    <Card class="mt-5">
      <Table :data-source="state.results" :columns="columns" :bordered="true">
        <template #bodyCell="{ column, text, record  }">
          <template v-if="column.key === 'imageName'">
            <RouterLink :to="{ name: alias.Work.name, params:{ workId: record.id } }">
              <Button type="link">{{ text }}</Button>
            </RouterLink>
          </template>
          <template v-else-if="column.key === 'imageStatus'" >
            <span>{{changeStatus(record.imageStatus)}}</span>
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