<script setup lang="ts">
/**
* @file 面包屑 - 项目详情
**/
import * as alias from "src/router/alias";
import {RouterLink} from "vue-router";
import { Breadcrumb, BreadcrumbItem } from "ant-design-vue";

</script>

<template>
  <Breadcrumb>
    <BreadcrumbItem>
      <RouterLink :to="{ name: alias.ProjectList.name }">
        <span>项目列表</span>
      </RouterLink>
    </BreadcrumbItem>
    <BreadcrumbItem>项目中心</BreadcrumbItem>
  </Breadcrumb>
</template>
