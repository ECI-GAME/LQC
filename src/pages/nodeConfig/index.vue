<!--节点配置页面 -->
<script setup lang="ts">
/**
 * @file 错误类型配置
 */
import api from "src/api";
import { onMounted, ref } from 'vue';
import { useRoute } from "vue-router";
import * as alias from "src/router/alias";
import {Icon} from "@ue/icon";

import { Button, Breadcrumb, BreadcrumbItem, Row, Col,Popconfirm } from "ant-design-vue";
import { VueDraggableNext } from 'vue-draggable-next';
import {onCreate} from "src/utils/nodeConfig";
import {onCreatePerson} from "src/utils/person";



const route = useRoute();
const projectId = route.params.projectId;
let methodList = ref([]);
let personList = ref([]);

const initMethod = async () => {
  try {
    methodList.value = await api.project.getProjectMethodById(projectId);
    console.log(methodList.value);
    intPerson()
  } catch (error) {
    console.error("Failed to fetch language:", error);
    
    
  }
};
onMounted(() => {
  initMethod();
 

});
let nodeId = 0;
const intPerson = async () => {
  if (nodeId === 0) {
   
    methodList.value.forEach(e => {
      if (e.choseEle === 1) {
        nodeId = e.id
        console.log('node_id:'+nodeId);
        console.log('node_id:'+e.id);
      }
    })
  }
  personList.value = await api.project.getProjectPersonById(nodeId);
};



const log = (event) => {
  console.log('-----------');
  console.log(event.moved.newIndex);
  console.log(event.moved.element);

  console.log(event.moved.element.orderBy);
  console.log('-----------');
  console.log(methodList);

};
const changePerson = function (element) {
  methodList.value.forEach(e => {
    e.choseEle = 0
  });
  nodeId = element.id
  element.choseEle = 1
  console.log(element);
  console.log(nodeId);

  intPerson()
}

const deletePerson =async function(id: number){
  const status = await api.project.deletePerson(id);
  console.log('status:'+status);
  await intPerson();
  
}

const deleteNode =async function(id: number){
  const status = await api.project.deleteNode(id);
  console.log('status:'+status);
  await initMethod();
  
}

const onCreateWorkFlow = async function () {
  const status = await onCreate(methodList.value,projectId);
  if (status) {
    await initMethod();
  }
}
const onCreatePeople = async function () {
  const status = await onCreatePerson(nodeId);
  if (status) {
    await intPerson();
  }
}

const saveNodeInfo =async function  (){
  console.log(methodList.value);
  
  await api.project.updateProMethSort(methodList.value)
}

</script>

<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem>
        <RouterLink :to="{ name: alias.ProjectDetails.name, params: { projectId: projectId } }">
          <a href="">项目中心</a>
        </RouterLink>
      </BreadcrumbItem>
      <BreadcrumbItem>节点配置页面</BreadcrumbItem>
    </Breadcrumb>
    <div class="flex m-10">
      <Row class="w-11/12">
        <Col :span="11">
        <div class="h-10">
          <span class="float-left font-bold text-xl">流程节点</span>

          <Button class="float-right bg-blue-700  ms-3" type="primary" @click="onCreateWorkFlow">新增流程节点</Button>
          <Button class="float-right bg-violet-700" @click="saveNodeInfo" type="primary">保存</Button>
        </div>
        <VueDraggableNext class="dragArea list-group w-full cursor-pointer" :list="methodList" @change="log">
          <div v-for="element in methodList" :key="element.methCode">
            <div class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center" v-if="element.choseEle == 1"
              @click="changePerson(element)" style="background-color: blue;color: white;">
              {{ element.methodName }}

              <Popconfirm
              title="确认删除该节点信息吗?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="deleteNode(element.id)"
            >
            <Icon class="text-xl text-primary cursor-pointer float-right text-white" type="delete" ></Icon>
            </Popconfirm>
            </div>
            <div class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center" @click="changePerson(element)"
              v-else>
              {{ element.methodName }}

              <Popconfirm
              title="确认删除该节点信息吗?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="deleteNode(element.id)"
            >
            <Icon class="text-xl text-primary cursor-pointer float-right" type="delete" ></Icon>
            </Popconfirm>
            </div>
          </div>
        </VueDraggableNext>
        </Col>
        <Col :span="1">
        </Col>
        <Col :span="11">
        <div class="h-10">
          <span class="float-left font-bold text-xl">人员信息</span>
          <Button class="float-right bg-blue-700" type="primary" @click="onCreatePeople">添加人员</Button>
        </div>

        <div class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center" v-for="person in personList"
          :key="person.handlerId">
          {{ person.handlerName }}
          <Popconfirm
              title="确认删除该人员信息吗?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="deletePerson(person.id)"
            >
            <Icon class="text-xl text-primary cursor-pointer float-right" type="delete" ></Icon>
            </Popconfirm>
          
        </div>

        </Col>
      </Row>
    </div>
  </div>
</template>

<style>
/* Add any necessary styles */
</style>
