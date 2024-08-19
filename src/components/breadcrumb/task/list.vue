<script setup lang="ts">
/**
 * @file 面包屑 - 任务列表 / 项目中心 - 任务列表
 **/

import * as alias from "src/router/alias";
import {RouterLink, useRoute} from "vue-router";
import {Breadcrumb, BreadcrumbItem} from "ant-design-vue";


const route = useRoute();

</script>

<template>
  <Breadcrumb>
    <BreadcrumbItem>
      <RouterLink :to="{ name: alias.ProjectDetails.name, params:{ projectId: route.params.projectId } }">
        <span>项目中心</span>
      </RouterLink>
    </BreadcrumbItem>
    <BreadcrumbItem>任务列表</BreadcrumbItem>
  </Breadcrumb>
</template>
