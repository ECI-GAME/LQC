<script setup lang="ts">
/**
 * @file 图片管理
 */
 import api from "src/api";
 import * as model from "src/utils/model";

import {Icon} from "@ue/icon";
import {onCreate} from "./config";
import * as alias from "src/router/alias";
import {RouterLink, useRoute} from "vue-router";
import {Table, Button, Card, Form, FormItem, Input, Space, Select,message} from "ant-design-vue";
import Upload from "src/components/upload/index.vue";
import { FileData } from "src/utils/upload/common";


const route = useRoute();
console.log('Project ID = "%s"', route.params.projectId);

const columns = [
  {title: "图片名称", dataIndex: 'imageName', key: 'imageName'},
  {title: "关联画册", dataIndex: 'versionId', key: 'versionId'},
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

let isOnloading = false;

const {state, execute: onLoad, isLoading} = model.list<object>(

  function () {
    return api.version.geVersionImageDeailByVId(1);
  },
  new model.PageResult<object>([]),  
  true
);
const onSuccess = async function (files: FileData[]) {
  let fileInfo: any[] = [];
  console.log('------');
  
  console.log(files);
  
  files.forEach( s=>{
    fileInfo.push({
      'imageName':s.fileName,
      'imageSize':s.size,
      'originalImagePath':s.src,
      'imageType':s.type,
      'projectNum': 'C24071700002',
      'versionId':'1'
  
    })
   
  })
  console.log(fileInfo);
  console.log('------');
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

</script>

<template>
  <div >
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
            <Button>搜索</Button>
            <Button>重置</Button>
          </Space>
        </FormItem>
      </Form>
    </Card>

    <Card class="mt-5" >
      <Space size="large">
        <Upload :multiple="true" @success="onSuccess" @loading="isOnloading">
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