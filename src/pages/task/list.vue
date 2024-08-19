<script setup lang="ts">
/**
 * @file 任务列表
 */
import api from "src/api";
import * as model from "src/utils/model";
import {ref} from 'vue';
import Page from "src/components/page/index.vue";
import {onCreate, columns} from "./config";
import * as alias from "src/router/alias";
import {RouterLink, useRoute} from "vue-router";
import {
  Table,
  Button,
  Card,
  Form,
  FormItem,
  Input,
  Space,
  Progress,
  Breadcrumb,
  BreadcrumbItem,
  Tag
} from "ant-design-vue";
import {Icon} from "@ue/icon";


const route = useRoute();
const pageNumber = ref(1)
const versionId: number = route.params.versionId as any;

// 初始化集合
const {state, execute: onLoad, isLoading} = model.list<object>(function () {
    return api.task.list(pageNumber.value, versionId);
  },
  new model.PageResult<object>([]),
  true
);

const {state: taskStatus} = model.list<object>(function () {
    return api.system.getDictData('comic_task_status');
  },
  new model.PageResult<object>([]),
  true
);


const searchInfo = () => {
  onLoad(100)
}
const onCreateTask = async function () {
  console.log(versionId);
  const res = await onCreate(versionId, 1);
  console.log(res);
  if (res) {
    await onLoad(100); // 100 毫秒后刷新列表
  }
}

const editFrom = async function (id: number) {
  const status = await onCreate(id, 2);

  if (status) {
    onLoad(100);
  }
}
//状态映射
const changeStatus = function (dict: String) {
  for (const element of taskStatus.value.results) {
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
      <Table :data-source="state.results" :columns="columns" :bordered="true" :loading="isLoading" :pagination="false">
        <template #bodyCell="{ column, text, record  }">
          <template v-if="column.key === 'taskName'">
            <RouterLink :to="{ name: alias.Work.name, params:{ taskId: record.id,workId:record.relationId } }">
              <Button type="link" class="px-0">{{ text }}</Button>
            </RouterLink>
          </template>
          <template v-else-if="column.key === 'taskStatus'">
            <span>{{ changeStatus(record.taskStatus) }}</span>
          </template>
          <template v-else-if="column.key === 'handlerName'">
            <template v-for="name in text.split(';')" :key="name">
              <Tag v-if="name" color="blue">{{ name }}</Tag>
            </template>
          </template>
          <template v-else-if="column.key === 'doneCnt'">
            <Progress :percent="changeProcess(record.doneCnt,record.totalCnt)" status="active" :showInfo="true"
                      :format="() => `${record.doneCnt} /${record.totalCnt}`"/>
          </template>
          <template v-else-if="column.key === 'action'">
            <span class="inline-block">
              <Icon class="text-xl text-primary cursor-pointer" type="edit-square" @click="editFrom(record.id)"></Icon>
                            <RouterLink
                                :to="{ name: alias.TaskDetails.name, params:{ versionId: record.versionId, taskId: record.id } }">
                              <Icon class="text-xl text-primary cursor-pointer ml-2" type="table"></Icon>
                          </RouterLink>
            </span>
          </template>
          <template v-else>{{ text || "--" }}</template>
        </template>
      </Table>
      <Page :total="state.total" v-model:page="pageNumber" @click="searchInfo"></Page>
    </Card>
  </div>
</template>