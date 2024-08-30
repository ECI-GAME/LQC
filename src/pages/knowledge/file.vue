<script setup lang="ts">
/**
 * @file 知识库
 */

import api from "src/api";
import {Icon} from "@ue/icon";
import {ref, reactive} from 'vue';
import * as model from "src/utils/model";
import Version from "./comp/version.vue";
import {FileData} from "src/utils/upload/common";
import Upload from "src/components/upload/index.vue";
import Pagination from "src/components/page/index.vue";
import {Table, Form, FormItem, InputSearch, Button, message} from "ant-design-vue";

const props = defineProps({
  projectId: {
    type: [String, Number],
    required: true,
  },
  versionId: {
    type: [String, Number],
    required: false,
  },
})

class FormState {
  searchValue?: string;
  versionId?: number;

  constructor() {
    if (props.versionId) {
      this.versionId = Number(props.versionId);
    }
  }
}


let fileInfo: any[] = [];
const versionInfo = ref({});
const pageSize = ref<number>(10);
const pageNumber = ref<number>(1);
const isUploading = ref<boolean>(false);
const fromData = ref<FormState>(new FormState());


interface FormState {
  typeId: number
  fileName: string;
  fileType: string;
}

const formState = reactive({
  typeId: props.projectId,
  fileName: '',
  fileType: ''
});

const columns = [
  {title: "关联项目", dataIndex: 'projectName', key: 'projectName'},
  {title: "关联版本", dataIndex: 'versionName', key: 'versionName'},
  {title: "文件名称", dataIndex: 'fileName', key: 'fileName'},
  {title: "文件大小", dataIndex: 'fileSize', key: 'fileSize'},
  {title: "文件类型", dataIndex: 'fileType', key: 'fileType', align: "center"},
  {title: "创建人", dataIndex: 'createByName', key: 'createByName', align: "center"},
  {title: "创建时间", dataIndex: 'createTime', key: 'createTime', align: "center"},
  {title: "操作", dataIndex: 'id', key: 'action', align: "center"},
];

const {state, execute: onLoad, isLoading} = model.list<object>(function () {
  return api.knowLedge.list(pageNumber.value, props.projectId, fromData.value.versionId, fromData.value.searchValue, "1", pageSize.value);
}, new model.PageResult<object>([]), true);


const onSearch = () => {
  pageNumber.value = 1;
  onLoad(100);
}

const changePage = () => onLoad(100);

//文件上传
const onSuccess = async function (files: FileData[]) {

  files.forEach(s => {
    fileInfo.push({
      'fileName': s.fileName,
      'fileSize': s.size,
      'filePath': s.src,
      'fileType': s.type,
      'projectId': props.projectId,
      'versionId': versionInfo.value.versionId || 0,
      "resourceType": '1'
    })

  })

  const res = await api.project.addKnowLedgeInfo(fileInfo);
  console.log(res);
  if (res) {
    message.success("上传成功")
  }
  files = []
  fileInfo = []

  onLoad(100)

}

</script>
<template>
  <div>
    <Form layout="inline" :model="formState">
      <FormItem>
        <Version class="w-50" v-model:value="fromData.versionId" :project-id="projectId"></Version>
      </FormItem>
      <FormItem>
        <InputSearch v-model:value="fromData.searchValue"
                     placeholder="请输入条件"
                     enter-button
                     allow-clear
                     @search="onSearch"
                     class="w-100 float-left"/>
      </FormItem>
      <FormItem>
        <Upload :multiple="true"
                @success="onSuccess"
                class="ml-3"
                v-model:loading="isUploading">
          <Button :loading="isUploading">资源上传</Button>
        </Upload>
      </FormItem>
    </Form>

    <Table class="mt-5"
           :loading="isLoading"
           :data-source="state.results"
           :columns="columns"
           :bordered="true"
           :pagination="false">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.key === 'action'">
                    <span class="inline-block">
                        <Icon class="text-xl text-primary cursor-pointer" type="download"></Icon>
                    </span>
        </template>
      </template>
    </Table>

    <Pagination v-model:page="pageNumber" v-model:size="pageSize" :total="state.total" @click="changePage"></Pagination>
  </div>

</template>