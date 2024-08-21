<script setup lang="ts">
/**
 * @file 面包屑 - PS Config
 **/

import * as alias from "src/router/alias";
import {RouterLink, useRoute} from "vue-router";
import {Breadcrumb, BreadcrumbItem} from "ant-design-vue";

const route = useRoute();
</script>

<template>
  <Breadcrumb>
    <BreadcrumbItem>Home</BreadcrumbItem>
    <BreadcrumbItem>
      <RouterLink :to="{ name: alias.ProjectDetails.name, params: route.params }">项目中心</RouterLink>
    </BreadcrumbItem>
    <BreadcrumbItem>PSD 生成配置</BreadcrumbItem>
  </Breadcrumb>
</template>
