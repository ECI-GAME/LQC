<script setup lang="ts">
/**
 * @file 图片管理
 */
 import api from "src/api";
 import * as model from "src/utils/model";
import { ref } from "vue";
import {Icon} from "@ue/icon";
import {onCreate} from "./config";
import * as alias from "src/router/alias";
import {RouterLink, useRoute} from "vue-router";
import {Table, Button, Card, Form, FormItem, Input, Space, Select,message,Breadcrumb,BreadcrumbItem} from "ant-design-vue";
import Upload from "src/components/upload/index.vue";
import { FileData } from "src/utils/upload/common";


const route = useRoute();
console.log('Project ID = "%s"', route.params.projectId);

const versionInfos = ref([]);
let versionInfo = {};
const initVersioInfos = async () => {
  try {
    versionInfos.value = await api.version.geVersionInfoByPId(route.params.projectId);
    console.log(versionInfos.value);
    
    versionInfos.value.forEach(element => {
      if(element.versionStatus==1){
        versionInfo = element
      }
    });
    console.log('version');
    console.log(versionInfo);
    console.log('version');
    
  } catch (error) {
    console.error("Failed to fetch task status:", error);
  }
};

initVersioInfos()

const columns = [
  {title: "图片名称", dataIndex: 'imageName', key: 'imageName'},
  {title: "关联画册", dataIndex: 'versionName', key: 'versionName'},
  {title: "状态", dataIndex: 'imageStatus', key: 'imageStatus', align: "center"},
  {title: "当前处理人", dataIndex: 'handlerName', key: 'handlerName', align: "center"},
  {title: "原图", dataIndex: 'originalImagePath', key: 'originalImagePath', align: "center"},
  {title: "TEP 图片", dataIndex: 'tepImagePath', key: 'tepImagePath', align: "center"},
  {title: "PSD生成图片", dataIndex: 'psdPath', key: 'psdPath', align: "center"},
  {title: "DTP 图片(PSD)", dataIndex: 'dtpImagePath', key: 'dtpImagePath', align: "center"},
  {title: "QA 图片", dataIndex: 'notesImagePath', key: 'notesImagePath', align: "center"},
  {title: "归档图片", dataIndex: 'deliveryImagePath', key: 'deliveryImagePath', align: "center"},
  {title: "关联任务", dataIndex: 'taskName', key: 'image', align: "center"},
  
  {title: "操作", dataIndex: 'id', key: 'action', align: "right"},
];

const isOnloading = ref<boolean>(false);

const {state, execute: onLoad, isLoading} = model.list<object>(

  function () {
    console.log('versionid');
    console.log(versionInfo.id);
    
    
    return api.version.geVersionImageDeailByVId(versionInfo.id);
  },
  new model.PageResult<object>([]),  
  true
);
let fileInfo: any[] = [];
const onSuccess = async function (files: FileData[]) {
  console.log('------');
  
  console.log(files);
  
  files.forEach( s=>{
    fileInfo.push({
      'imageName':s.fileName,
      'imageSize':s.size,
      'originalImagePath':s.src,
      'imageType':s.type,
      'projectNum':versionInfo.projectNum,
      'versionId':versionInfo.id
  
    })
   
  })
  message.success("上传成功")
  api.version.addVersionImage(fileInfo);
  onLoad(100)

}
const openImage = function(data:string){
  console.log(data);
  
  window.open(data)
}
const onCreateTask = async function () {
  const res = await onCreate();
  console.log(res);
}
const searchImage = async function () {
  onLoad(100)
}






</script>

<template>
   
  <div >
    <Breadcrumb>
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem>
        <RouterLink :to="{ name: alias.ProjectDetails.name, params: { projectId: projectId } }">
          <a href="">项目中心</a>
        </RouterLink>
      </BreadcrumbItem>
      <BreadcrumbItem>节点配置页面</BreadcrumbItem>
    </Breadcrumb>
    <br/>
    <Card >
      <Form layout="inline">
        <FormItem label="画册">
          <Select class="w-30"/>
        </FormItem>
        <FormItem label="图片名称">
          <Input/>
        </FormItem>
        
        <FormItem>
          <Space>
            <Button type="primary" @click="searchImage">搜索</Button>
            <Button>重置</Button>
          </Space>
        </FormItem>
      </Form>
    </Card>

    <Card class="mt-5" >
      <Space size="large">
        <Upload :multiple="true" @success="onSuccess" v-model:loading="isOnloading">
          <Button :loading="isOnloading">图片上传</Button>
        </Upload>
            
      </Space>
    </Card>

    <Card class="mt-5">
      <Table :data-source="state.results"  :columns="columns" :bordered="true">
        <template #bodyCell="{ column, text, record  }">
          <template v-if="column.key === 'name'">
            <RouterLink :to="{ name: alias.TaskDetails.name, params:{ projectId: record.projectId, taskId: record.id } }">
              <Button type="link">{{ text }}</Button>
            </RouterLink>
          </template>
          
          <template v-else-if="['originalImagePath', 'tepImagePath', 'psdPath', 'dtpImagePath', 'notesImagePath', 'deliveryImagePath'].includes(column.key)">
            <Button v-if="text" type="link" @click="openImage(record[column.key])">预览</Button>
            <span v-else>待生成</span>
          </template>
          <template v-else-if="column.key === 'action'">
          <span class="inline-block">
            <Icon class="text-xl text-primary cursor-pointer" type="edit-square"></Icon>
          </span>
          </template>
        </template>
      </Table>
    </Card>
  </div>
</template>