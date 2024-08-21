<script setup lang="ts">
/**
 * @file 面包屑 - 任务明细
 **/

import api from "src/api";
import * as model from "src/utils/model";
import * as alias from "src/router/alias";
import {RouterLink, useRoute} from "vue-router";
import {Breadcrumb, BreadcrumbItem} from "ant-design-vue";

import type {TaskData} from "src/types/task";

const route = useRoute();

const {state, isReady} = model.result<TaskData>(() => {
  return api.task.getTaskInfoById(route.params.taskId as string);
}, {} as TaskData, true);

</script>

<template>
  <Breadcrumb>
    <BreadcrumbItem>
      <RouterLink :to="{ name: alias.ProjectList.name }">
        <span>项目列表</span>
      </RouterLink>
    </BreadcrumbItem>
    <template v-if="isReady">
      <BreadcrumbItem>
        <RouterLink :to="{ name: alias.ProjectDetails.name, params:{ projectId: state.projectId } }">
          <span>项目中心</span>
        </RouterLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <RouterLink
            :to="{ name: alias.TaskList.name, params: { projectId: state.projectId, versionId: state.versionId } }">
          <span>任务中心</span>
        </RouterLink>
      </BreadcrumbItem>
      <BreadcrumbItem>任务明细</BreadcrumbItem>
    </template>
  </Breadcrumb>
</template>
