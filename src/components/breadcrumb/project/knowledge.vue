<script setup lang="ts">
/**
 * @file 面包屑 - 项目中心 知识库
 **/

import * as alias from "src/router/alias";
import {RouterLink, useRoute} from "vue-router";
import {Breadcrumb, BreadcrumbItem} from "ant-design-vue";

const route = useRoute();
</script>

<template>
  <Breadcrumb>
    <BreadcrumbItem>
      <RouterLink :to="{ name: alias.ProjectList.name }">
        <span>项目列表</span>
      </RouterLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <RouterLink :to="{ name: alias.ProjectDetails.name, params: route.params }">项目中心</RouterLink>
    </BreadcrumbItem>
    <BreadcrumbItem>知识库</BreadcrumbItem>
  </Breadcrumb>
</template>
