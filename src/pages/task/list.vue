<script setup lang="ts">
/**
 * @file 任务列表
 */

import api from "src/api";
import {Icon} from "@ue/icon";
import * as alias from "src/router/alias";
import {useColumns, useTask} from "./config";
import * as model from "src/utils/model";
import {ref, onMounted, computed} from 'vue';
import {RouterLink, useRoute} from "vue-router";
import Tags from "./comp/tag.vue";
import Progress from "./comp/progress.vue";
import Time from "src/components/time/index.vue";
import Page from "src/components/page/index.vue";
import Dict from "src/components/dict/index.vue";
import {Table, Button, Card, Form, FormItem, Input, Space} from "ant-design-vue";
import {SearchOutlined, PlusOutlined} from "@ant-design/icons-vue";


import type {TaskData} from "src/types";

const route = useRoute();
const pageNumber = ref(1);

const projectId = computed(() => route.params.projectId);

const {versionId, create: onCreate, edit: onEdit, reload: onReload} = useTask();

const columns = useColumns(projectId.value);
// 任务列表
const {state, execute: onLoad, isLoading} = model.list<TaskData>(function () {
  return api.task.list<TaskData>(pageNumber.value, versionId.value);
});

const searchInfo = () => {
  onLoad(100)
}
const onCreateTask = async function () {
  const res = await onCreate();
  if (res) {
    await onLoad(100); // 100 毫秒后刷新列表
  }
}

const editFrom = async function (value: TaskData) {
  // 重新加载数据
  await onReload(value.versionId);
  const status = await onEdit(value);
  if (status) {
    await onLoad(100);
  }
}

onMounted(function () {
  const version = route.params.versionId as string;
  if (version) {
    onReload(version);
  }
  searchInfo();
});
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
          <Space>
            <Button type="primary" @click="searchInfo" style="background-color: #1E90FF !important;color: white;">

              <template #icon>
                <SearchOutlined class="my-0 inline-flex"/>
              </template>
              搜索
            </Button>
            <Button>

              重置
            </Button>
          </Space>
        </FormItem>
      </Form>
    </Card>

    <Card class="mt-5" v-if="projectId">
      <Space size="large">
        <Button @click="onCreateTask" type="primary" style="background-color: #400ded !important;color: white;">
          <template #icon>
            <PlusOutlined class="my-0 inline-flex"/>
          </template>
          新建任务
        </Button>
        <Button>生成交付文件</Button>
        <Button>归档</Button>
      </Space>
    </Card>

    <Card class="mt-5">
      <Table :data-source="state.results" :columns="columns" :bordered="true" :loading="isLoading" :pagination="false"
             table-layout="auto">
        <template #bodyCell="{ column, text, record  }">
          <template v-if="column.key === 'taskName'">
            <RouterLink :to="{ name: alias.Work.name, params:{ taskId: record.id,workId:record.relationId } }">
              <Button type="link" class="px-0">{{ text }}</Button>
            </RouterLink>
          </template>
          <Dict v-else-if="column.key === 'taskStatus'" type="comic_task_status" :value="text"></Dict>
          <Time v-else-if="column.key === 'time'" :value="text"></Time>
          <Tags v-else-if="column.key === 'tags'" :value="text"></Tags>
          <Progress v-else-if="column.key === 'progress'" :total="record.totalCnt" :value="record.doneCnt"/>
          <template v-else-if="column.key === 'action'">
            <Space class="text-xl text-primary">
              <Icon class="cursor-pointer" type="edit-square" @click="editFrom(record)"></Icon>
              <RouterLink
                  :to="{ name: alias.TaskDetails.name, params:{ versionId: record.versionId, taskId: record.id } }">
                <Icon type="table"></Icon>
              </RouterLink>
            </Space>
          </template>
          <template v-else>{{ text || "--" }}</template>
        </template>
      </Table>
      <Page :total="state.total" v-model:page="pageNumber" @click="searchInfo"></Page>
    </Card>
  </div>
</template>

