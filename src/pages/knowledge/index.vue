<script setup lang="ts">
/**
 * @file 知识库
 */
 import {ref} from "vue"
 import api from "src/api";
 import {RouterLink, useRoute} from "vue-router";
 import * as alias from "src/router/alias";
 import {Table, Button, Card, Space,Breadcrumb,BreadcrumbItem,Row,Col, Tag, Tabs,TabPane  } from "ant-design-vue";
import fileInfo from './file.vue'
import textFile from './text.vue'
import ImageFile from './image.vue'

const route = useRoute();
console.log('Project ID = "%s"', route.params.projectId);
const projectId = route.params.projectId

const activeKey = ref('1');

</script>

<template>
  <div>

    
    <Breadcrumb>
    <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem>
        <RouterLink :to="{ name: alias.ProjectList.name }">
            <a href="">项目列表</a>
        </RouterLink>
    </BreadcrumbItem>  
    <BreadcrumbItem>
        <RouterLink :to="{ name: alias.ProjectDetails.name, params:{ projectId: projectId } }">
            <a href="">项目中心</a>
        </RouterLink>
      </BreadcrumbItem>    
      <BreadcrumbItem>知识库</BreadcrumbItem>
    </Breadcrumb>
    <Tabs v-model:activeKey="activeKey">
      <TabPane key="1" tab="文件资源"><fileInfo/></TabPane>
      <TabPane key="2" tab="文本资源"><textFile/></TabPane>
      <TabPane key="3" tab="图片资源"><ImageFile/></TabPane>
    </Tabs>
  </div>
</template>