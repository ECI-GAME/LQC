<script setup lang="ts">
/**
 * @file 任务列表
 * @author svon.me@gmail.com
 */

import api from "src/api";
import {Icon} from "@ue/icon";
import Tags from "src/components/ue/tag.vue";
import * as model from "src/utils/model";
import * as alias from "src/router/alias";
import Progress from "src/components/ue/progress.vue";
import {ref, onMounted, computed} from 'vue';
import {RouterLink, useRoute} from "vue-router";
import Time from "src/components/time/index.vue";
import Page from "src/components/page/index.vue";
import Dict from "src/components/dict/index.vue";
import Select from "src/components/dict/select.vue";
import {useColumns, useTask, Search} from "./config";
import {Table, Button, Card, Form, FormItem, Input, Space} from "ant-design-vue";


import type {TaskData} from "src/types";

const route = useRoute();
const pageNumber = ref<number>(1);
const pageSize = ref<number>(10);
const search = ref<Search>(new Search());
const TaskStatus = "comic_task_status";

const projectId = computed<string>(() => route.params.projectId as string);

const {versionId, create: onCreate, edit: onEdit, reload: onReload, isLoading} = useTask();

const columns = useColumns(projectId.value);
// 任务列表
const {state, execute: onLoad, isReady} = model.list<TaskData>(function () {
  return api.task.list<TaskData>(pageNumber.value, versionId.value, pageSize.value, search.value);
});

const searchInfo = () => {
  onLoad(100)
}

const onResetSearch = function () {
  search.value = new Search();
  searchInfo();
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

const changeHandlerName = function (param1: String, param2: String) {
  if (param1 && param2) {
    let param2Array = param2.split(',').map(item => item.trim());

    let combinedArray = [param1, ...param2Array];

    let uniqueArray = [...new Set(combinedArray)];


    return uniqueArray.join(';');
  }

  return param1 || param2 || '';
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
          <Input v-model:value="search.taskName" placeholder="请输入任务名称" :allow-clear="true"/>
        </FormItem>
        <FormItem label="状态">
          <div class="w-50">
            <Select :type="TaskStatus" v-model:value="search.taskType" placeholder="请选择状态"
                    :allow-clear="true"/>
          </div>
        </FormItem>
        <FormItem label="处理人">
          <Input v-model:value="search.handlerName" placeholder="请输入处理人名称" :allow-clear="true"/>
        </FormItem>
        <FormItem>
          <Space>
            <Button type="primary" @click="searchInfo">
              <Space>
                <Icon class="flex text-base" type="search"></Icon>
                <span>搜索</span>
              </Space>
            </Button>
            <Button @click="onResetSearch">
              <Space>
                <Icon class="flex text-base" type="redo"></Icon>
                <span>重置</span>
              </Space>
            </Button>
          </Space>
        </FormItem>
      </Form>
    </Card>

    <Card class="mt-5" v-if="projectId">
      <Space size="large">
        <Button @click="onCreateTask" type="primary" :disabled="isLoading">
          <Space>
            <Icon class="flex text-base" type="plus"></Icon>
            <span>新建任务</span>
          </Space>
        </Button>
        <Button>
          <Space>
            <Icon class="flex text-base" type="file-add"></Icon>
            <span>生成交付文件</span>
          </Space>
        </Button>
        <Button>
          <Space>
            <Icon class="flex text-base" type="file-zip"></Icon>
            <span>归档</span>
          </Space>
        </Button>
      </Space>
    </Card>

    <Card class="mt-5">
      <Table :data-source="state.results" :columns="columns" :bordered="true" :loading="!isReady" :pagination="false"
             table-layout="auto">
        <template #bodyCell="{ column, text, record  }">
          <template v-if="column.key === 'taskName'">
            <RouterLink :to="{ name: alias.Work.name, params:{ taskId: record.id,workId:record.relationId } }" target="_blank">
              <Button type="link" class="px-0">{{ text }}</Button>
            </RouterLink>
          </template>
          <Dict v-else-if="column.key === 'taskStatus'" :type="TaskStatus" :value="text"></Dict>
          <Time v-else-if="column.key === 'time'" :value="text"></Time>
          <template v-else-if="column.key === 'tags'">
            <Tags :value="changeHandlerName(record.handlerName, record.imgHandlerName)"></Tags>
          </template>
          <Progress v-else-if="column.key === 'progress'" :total="record.totalCnt" :value="record.doneCnt"/>
          <template v-else-if="column.key === 'action'">
            <Space class="text-xl text-primary">
              <!--编辑任务-->
              <Button type="link" class="p-0 m-0" :disabled="isLoading" @click="editFrom(record)">
                <Space :size="4">
                  <Icon class="flex text-lg" type="edit-square" ></Icon>
                  <span>编辑</span>
                </Space>
              </Button>
              <!--任务明细-->
              <RouterLink :to="{ name: alias.TaskDetails.name, params:{ versionId: record.versionId, taskId: record.id } }">
                <Button type="link" class="p-0 m-0">
                  <Space :size="4">
                    <Icon class="flex text-lg" type="table"></Icon>
                    <span>明细</span>
                  </Space>
                </Button>
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
