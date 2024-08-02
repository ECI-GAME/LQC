<!-- <script setup lang="ts">
import { ref } from 'vue';
import draggable from 'vuedraggable';

const items = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
]);

const onEnd = (evt) => {
  console.log('Drag ended:', evt);
};
</script>

<style scoped>
.draggable-item {
  padding: 10px;
  margin: 5px 0;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  cursor: grab;
}
</style>

<template>
  <div>
    <draggable v-model="items" @end="onEnd">
      <transition-group>
        <div v-for="(item, index) in items" :key="item.id" class="draggable-item">
          {{ item.name }}
        </div>
      </transition-group>
    </draggable>
  </div>
</template>
 -->
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
        <RouterLink :to="{ name: alias.ProjectList.name }">
            <a href="">项目列表</a>
        </RouterLink>
    </BreadcrumbItem>  
    <BreadcrumbItem>
        <RouterLink :to="{ name: alias.ProjectDetails.name, params:{ projectId: projectId } }">
            <a href="">项目中心</a>
        </RouterLink>
      </BreadcrumbItem>    
      <BreadcrumbItem>流程人员配置</BreadcrumbItem>
    </Breadcrumb>
    
    
  </div>
</template>