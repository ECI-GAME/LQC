<script setup lang="ts">
/**
 * @file 图片管理
 */
 import api from "src/api";
 import * as model from "src/utils/model";
import { ref,onMounted } from "vue";
import {Icon} from "@ue/icon";
import * as alias from "src/router/alias";
import {RouterLink, useRoute} from "vue-router";
import {Table, Button, Card, Form, FormItem, Input, Space, Select,message,Breadcrumb,BreadcrumbItem,Popconfirm,} from "ant-design-vue";
import Upload from "src/components/upload/index.vue";
import { FileData } from "src/utils/upload/common";
import {ElSelect,ElOption} from "element-plus"


const route = useRoute();
console.log('Project ID = "%s"', route.params.projectId);
const pageNumber = ref(1)
const fromData = ref({})
const tableDate = ref({})
const versionOption =ref([])



const confirmDelete =async function (rowInfo:object){
  if(rowInfo.taskName!=null||rowInfo.taskName!=undefined){
    message.warning('当前图片还有任务关联，请先取消关联关系!')
    return
  }
  
  await api.version.deleteImageByVid(rowInfo.id);
  onLoad(100)
}


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
  
  {title: "操作", dataIndex: 'id', key: 'action', align: "center"},
];

const isOnloading = ref<boolean>(false);


const initTable = async function(){
  const formData = {
      'versionId':fromData.value.versionId||null,
      'pageSize':10,
      'pageNum':pageNumber.value,
      'projectId': route.params.projectId,
      'imageName':fromData.value.imageName||"",
    } 
    const res = await api.version.geVersionImageDetailPage(formData)
    
    
    
    
}

let fileInfo: any[] = [];
const onSuccess = async function (files: FileData[]) {
  files.forEach( s=>{
    fileInfo.push({
      'imageName':s.fileName,
      'imageSize':s.size,
      'originalImagePath':s.src,
      'imageType':s.type,
      'projectNum':versionInfo.projectNum,
      'versionId':FormData.value.versionId||""
  
    })
   
  })
  message.success("上传成功")
  api.version.addVersionImage(fileInfo);
  initTable(100)

}
const openImage = function(data:string){
  console.log(data);
  
  window.open(data)
}
const searchImage = async function () {
  initTable(100)
}



const changePage = function(page){
  pageNumber.value = page
  initTable()
}
onMounted(async () => {
  try {
    versionOption.value = await api.project.getVersionDict(route.params.projectId);
    initTable()
  } catch (error) {
    console.error('Error fetching project info:', error);
  }
});

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
      <BreadcrumbItem>图片管理</BreadcrumbItem>
    </Breadcrumb>
    <br/>
    <Card >
      <Form layout="inline">
        <FormItem label="画册">
          <ElSelect v-model="fromData.versionId" placeholder="请选择画册" class="w-50" clearable >
                    <ElOption
                    v-for="item in versionOption"
                    :key="item.versionId"
                    :label="item.verisonName"
                    :value="item.versionId">
                    </ElOption>
                </ElSelect>
        </FormItem>
        <FormItem label="图片名称">
          <Input v-model:value="fromData.imageName"/>
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
      <Table :data-source="tableDate.rows" :pagination="false" :columns="columns" :bordered="true">
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
            <Popconfirm
              title="确认需要删除当前图片信息吗?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="confirmDelete(record)"
            >
              <Icon class="text-xl text-primary cursor-pointer" type="delete"></Icon>
            </Popconfirm>
            
          </span>
          </template>
        </template>
      </Table>
      <Pagination v-model:current="pageNumber" class="float-right" :total="tableDate.total" show-less-items @change="changePage" :show-total="total => `共 ${tableDate.total} 条`"/>
    </Card>
  </div>
</template>