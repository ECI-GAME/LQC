<script setup lang="ts">
/**
 * @file 面包屑 - 项目中心
 **/

import * as alias from "src/router/alias";
import {RouterLink, useRoute} from "vue-router";
import {Breadcrumb, BreadcrumbItem} from "ant-design-vue";

defineProps({
  title: {
    type: String,
    required: false
  }
});
const route = useRoute();

</script>

<template>
  <Breadcrumb>
    <BreadcrumbItem>
      <RouterLink :to="{ name: alias.ProjectList.name }">
        <span>项目列表</span>
      </RouterLink>
    </BreadcrumbItem>
    <template v-if="title">
      <BreadcrumbItem>
        <RouterLink :to="{ name: alias.ProjectDetails.name, params: route.params }">项目中心</RouterLink>
      </BreadcrumbItem>
      <BreadcrumbItem>{{ title }}</BreadcrumbItem>
    </template>
    <template v-else>
      <BreadcrumbItem>项目中心</BreadcrumbItem>
    </template>
  </Breadcrumb>
</template>
