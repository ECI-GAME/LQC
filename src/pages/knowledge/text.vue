<!--文本-->
<script setup lang="ts">
/**
 * @file 知识库
 */
 import { onMounted, computed, ref } from 'vue';

import api from "src/api";
import { RouterLink, useRoute } from "vue-router";
import * as alias from "src/router/alias";
import * as model from "src/utils/model";
import { Table, Form, InputSearch, Button, FormProps,Upload,message } from "ant-design-vue";
import fileInfo from './file.vue'
import {Icon} from "@ue/icon";
import { reactive } from 'vue';
import {ElSelect,ElOption} from "element-plus"
import {onCreate} from "src/utils/textResource";
import { API_BASE} from "../../config";


import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';

const route = useRoute();
const versionOption =ref([])
console.log('Project ID = "%s"', route.params.projectId);
interface FormState {
    typeId: number
    searchValue: string;
    versionId: number
    
}
const formState: UnwrapRef<FormState> = reactive({
    typeId: route.params.projectId,
    searchValue: '',
    

});

const handleFinish: FormProps['onFinish'] = values => {
    console.log(values, formState);
};
const handleFinishFailed: FormProps['onFinishFailed'] = errors => {
    console.log(errors);
};


const columns = [
    { title: "关联项目", dataIndex: 'projectName', key: 'projectName' },
    { title: "关联版本", dataIndex: 'versionName', key: 'versionName' },
    { title: "原文", dataIndex: 'originalText', key: 'originalText' },
    { title: "建议译文", dataIndex: 'translationText', key: 'translationText' },
    { title: " 类别", dataIndex: 'typeName', key: 'textName' },
    { title: " 备注", dataIndex: 'remark', key: 'remark' },
    { title: "创建人", dataIndex: 'createBy', key: 'createBy', align: "center" },
    { title: "创建时间", dataIndex: 'createTime', key: 'createTime', align: "center" },
    { title: "操作", dataIndex: 'id', key: 'action', align: "center" },
];
const onSearch = ()=>{
    onLoad()
    console.log(state.value);
    
}
const exportTemple = ()=>{
    //api.project.exportTextResource()
    window.open(API_BASE + '/project/text/export/textTmp')
}

const importTemple = ()=>{
    let fromData = {}
    // file
    // projectNum
    api.project.importTextResource()
}
const { state, execute: onLoad, isLoading } = model.list<object>(
    function () {

        //return api.knowLedge.textList(1, formState.typeId);
        return api.knowLedge.textList(1, formState.typeId, formState.versionId,formState.searchValue);
    },
    new model.PageResult<object>([]),
    true
);

onMounted(async () => {
  try {
    versionOption.value = await api.project.getVersionDict(route.params.projectId);
    console.log(versionOption.value);
  } catch (error) {
    console.error('Error fetching project info:', error);
  }
});

const nweTextRource = async function () {
  const status = await onCreate(route.params.projectId);
  if (status) {
    onLoad(100);
  }
}
const fileList = ref([]);
const  uploadData = {'projectId':route.params.projectId}
const headers = {'Authorization':'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlaWQiOiIwMDAwMHJhMnp4bTUwc3BjNnEzMXdqOW9iZ2Z5NzRuZCIsInVzZXJfbmFtZSI6InJvb3QiLCJ0eiI6Ik1hcnF1ZXNhcyBTdGFuZGFyZCBUaW1lIiwicGlkIjotMSwib2lkIjotMSwib2xkaWQiOm51bGwsImNsaWVudF9pZCI6ImxxYV9nYW1lIiwiYXR0YWNocyI6IiIsImVuYW1lIjoiTFFBIiwiaHBpZCI6bnVsbCwiYXR5cGUiOiIxIiwic2NvcGUiOlsiYWxsIl0sImRuYW1lIjoiRUNJW-i2heeuoV0iLCJleHAiOjE3MjM4NjA3MjcsInF5d3giOm51bGwsImFpZCI6IjAwMDAwMDA1eHY2ZTkwb3RkbjdobWYyYjR1c3pqcGljIiwianRpIjoiNmM1YzY5N2YtYmFjMS00ZjM4LTk0NWYtM2Y2YmEyZjNhYTg0IiwiZGlkIjotMX0.XTx4E1JkqSByfJgWA-R5fmDnemadocrCeW8UHdADuufX5JnHuCXUDra9v4lqhZ1011xbU38nLs5mNxMkZ6YOD_IdHSBDtNRSYSJXaSCn45tsBfLinvBMZl_uoGWUFmrXs4up36UoDJtNIA9042iIQz65FFMwHZDJUtwp-L6FgVbe0ToM13c9W9BECV73dCfxth5LiZ-xtYU0MrMSyaUAApV5oQh0RfcyH6NiP7kL6_RKaU7Qdw7P9BR7WwCLiLJOsjfGqhp5kBE_e6ZRSnCmine9QI8aQjYGkkziDCSoit6_Xu-AouXn40ozV-VajVmDDHh4bWB9xXB7xd-FdPCizA'}
const handleChange = (info: UploadChangeParam) => {
    console.log(info);
    
    if(info.code!=200){
        message.error(info.msg);    
    }
    else{
        message.success(info.msg);    
        onLoad(100);
    }
    fileList.value = []
    return
};

const beforeUpload = (file: UploadProps['fileList'][number]) => {
    console.log(file.name);
    console.log(file.name.indexOf('xlsx')>-1);
    console.log(file.name.indexOf('xlsx'));
    
    
  const isJpgOrPng = file.name.indexOf('xlsx')>-1;
  if (!isJpgOrPng) {
    fileList.value = []
    message.error('仅支持xlsx格式文件上传!');
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 200;
  if (!isLt2M) {
    fileList.value = []
    message.error('上传附件必须小于200MB!');
    return false
  }
  return isJpgOrPng && isLt2M;
};
</script>
<template>
    <div>
        <Form layout="inline" :model="formState" @finish="handleFinish" @finishFailed="handleFinishFailed">
            <FromItem>
                
                <ElSelect v-model="formState.versionId" placeholder="请选择画册" class="w-50" clearable>
                    <ElOption
                    v-for="item in versionOption"
                    :key="item.versionId"
                    :label="item.verisonName"
                    :value="item.versionId">
                    </ElOption>
                </ElSelect>
            </FromItem>
            <FromItem>

                <InputSearch v-model:value="formState.searchValue" placeholder="请输入条件" enter-button @search="onSearch"
                    class="w-100 float-left" />
            </FromItem>
            <FromItem class="ml-3">
                <Button type="primary" class="bg-neutral-600" @click="exportTemple">导出</Button>
           
            </FromItem>
            <FromItem class="ml-3">
                <Upload
                    v-model:file-list="fileList"
                    name="file"
                    action="http://192.168.15.30:9999/eci-comic/project/text/upload/textResource"
                    :headers="headers"
                    :data="uploadData"
                     :show-upload-list="false"
                    :before-upload="beforeUpload"
                    @success="handleChange"
                >
                <Button type="primary" class="bg-violet-600">导入</Button>
                </Upload>
                
           
            </FromItem>
            <FromItem class="ml-3">
                <Button type="primary" class="bg-blue-600" @click="nweTextRource">新增</Button>
           
            </FromItem>
       
        </Form>

        <Table class="mt-5" :loading="isLoading" :data-source="state.results" :columns="columns" :bordered="true">
            <template #bodyCell="{ column, text, record }">
               
              
                <template v-if="column.key === 'action'">
                    <span class="inline-block">
                        <Icon class="text-xl text-primary cursor-pointer" type="edit-square"></Icon>
                    </span>
                </template>
            </template>
        </Table>
    </div>

</template>