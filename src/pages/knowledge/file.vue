<!--附件-->

<script setup lang="ts">
/**
 * @file 知识库
 */
import { onMounted, computed, ref } from 'vue';
import api from "src/api";
import { useRoute } from "vue-router";
import * as alias from "src/router/alias";
import * as model from "src/utils/model";
import { Table, Form, InputSearch, Button, FormProps,Select, message } from "ant-design-vue";
import {Icon} from "@ue/icon";
import { reactive } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import Upload from "src/components/upload/index.vue";
import { FileData } from "src/utils/upload/common";
import {ElSelect,ElOption} from "element-plus"



const route = useRoute();
console.log('Project ID = "%s"', route.params.projectId);
const isOnloading = ref<boolean>(false);
const versionOption =ref([])
const versionInfo = ref({})
const fromData = ref({
    searchValue : "",
})
let fileInfo: any[] = [];
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
    { title: "关联版本", dataIndex: 'versionName', key: 'versionName' },
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
        console.log(fromData.value);
        return api.knowLedge.list(1, route.params.projectId,fromData.value.versionId,fromData.value.searchValue,"1");
    },
    new model.PageResult<object>([]),
    true
);
//文件上传
const onSuccess = async function (files: FileData[]) {
  
  files.forEach( s=>{
    fileInfo.push({
      'fileName':s.fileName,
      'fileSize':s.size,
      'filePath':s.src,
      'fileType':s.type,
      'projectId':route.params.projectId,
      'versionId':versionInfo.value.versionId || 0,
      "resourceType":'1'
    })
   
  })
  
  const res = await api.project.addKnowLedgeInfo(fileInfo);
  console.log(res);
  if(res){
    message.success("上传成功")
  }
  files = []
  fileInfo = []
  
  onLoad(100)

}

const errorMethod = (files: FileData[])=>{
    console.log('upload error');
    files = []
}
onMounted(async () => {
  try {
    versionOption.value = await api.project.getVersionDict(route.params.projectId);
    console.log(versionOption.value);
  } catch (error) {
    console.error('Error fetching project info:', error);
  }
});
</script>
<template>
    <div>
        <Form layout="inline" :model="formState" @finish="handleFinish" @finishFailed="handleFinishFailed">
            <FromItem>
                
                <ElSelect v-model="fromData.versionId" placeholder="请选择画册" class="w-50" clearable >
                    <ElOption
                    v-for="item in versionOption"
                    :key="item.versionId"
                    :label="item.verisonName"
                    :value="item.versionId">
                    </ElOption>
                </ElSelect>
            </FromItem>
            <FromItem>

                <InputSearch v-model:value="fromData.searchValue" placeholder="请输入条件" enter-button allow-clear @search="onSearch"
                    class="w-100 float-left" />
            </FromItem>
            <FromItem>
                
            <Upload :multiple="true" @success="onSuccess" @abnormal="errorMethod" class="ml-3" v-model:loading="isOnloading">
                  <Button :loading="isOnloading">资源上传</Button>
            </Upload>
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