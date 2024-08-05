<!--图片资源-->

<script setup lang="ts">
/**
 * @file 知识库
 */
import { ref } from "vue"
import api from "src/api";
import { RouterLink, useRoute } from "vue-router";
import * as alias from "src/router/alias";
import * as model from "src/utils/model";
import { Table, Form, InputSearch, Button, FormProps } from "ant-design-vue";
import fileInfo from './file.vue'
import {Icon} from "@ue/icon";
import { reactive } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';

const route = useRoute();
console.log('Project ID = "%s"', route.params.projectId);
interface FormState {
    typeId: number
    fileName: string;
    fileType: string;
}
const formState: UnwrapRef<FormState> = reactive({
    typeId: route.params.projectId,
    fileName: '',
    fileType: ''
});

const handleFinish: FormProps['onFinish'] = values => {
    console.log(values, formState);
};
const handleFinishFailed: FormProps['onFinishFailed'] = errors => {
    console.log(errors);
};


const columns = [
    { title: "关联项目", dataIndex: 'projectName', key: 'projectName' },
    { title: "文件名称", dataIndex: 'fileName', key: 'fileName' },
    { title: "文件大小", dataIndex: 'fileSize', key: 'fileSize' },
    { title: "文件类型", dataIndex: 'fileType', key: 'fileType', align: "center" },
    { title: "创建人", dataIndex: 'createByName', key: 'createByName', align: "center" },
    { title: "创建时间", dataIndex: 'createTime', key: 'createTime', align: "center" },
    { title: "操作", dataIndex: 'id', key: 'action', align: "center" },
];
const onSearch = ()=>{
    onLoad()
    console.log(state.value);
    
}
const { state, execute: onLoad, isLoading } = model.list<object>(
    function () {

        //return api.knowLedge.list(1, formState.typeId);
        return api.knowLedge.list(1, 2);
    },
    new model.PageResult<object>([]),
    true
);

</script>
<template>
    <div>
        <Form layout="inline" :model="formState" @finish="handleFinish" @finishFailed="handleFinishFailed">
            <FromItem>

                <InputSearch v-model:value="formState.searchValue" placeholder="请输入条件" enter-button @search="onSearch"
                    class="w-100 float-left" />
            </FromItem>
            <FromItem>
                <Button type="primary" class="ml-3">上传</Button>
            </FromItem>
       
        </Form>

        <Table class="mt-5" :loading="isLoading" :data-source="state.results" :columns="columns" :bordered="true">
            <template #bodyCell="{ column, text, record }">
               
              
                <template v-if="column.key === 'action'">
                    <span class="inline-block">
                        <Icon class="text-xl text-primary cursor-pointer" type="download"></Icon>
                    </span>
                </template>
            </template>
        </Table>
    </div>

</template>