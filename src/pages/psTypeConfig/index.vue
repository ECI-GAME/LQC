<!--PSD 生成页面 -->
<script setup lang="ts">
/**
 * @file 错误类型配置
 */
 import api from "src/api";
 import {RouterLink, useRoute} from "vue-router";
 import * as alias from "src/router/alias";
 import {Table, Button, Card, Space,Breadcrumb,BreadcrumbItem,Row,Col, Tag  } from "ant-design-vue";


const route = useRoute();
console.log('Project ID = "%s"', route.params.projectId);
const projectId = route.params.projectId



</script>

<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem>
        <RouterLink :to="{ name: alias.ProjectDetails.name, params:{ projectId: projectId } }">
            <a href="">项目中心</a>
        </RouterLink>
    </BreadcrumbItem>    
      <BreadcrumbItem>PSD 生成配置</BreadcrumbItem>
    </Breadcrumb>
    
    
  </div>
</template>