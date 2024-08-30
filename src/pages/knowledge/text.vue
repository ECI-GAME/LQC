<!--文本-->
<script setup lang="ts">
/**
 * @file 知识库
 */


import api from "src/api";
import {Icon} from "@ue/icon";
import Version from "./comp/version.vue";
import * as model from "src/utils/model";
import {computed, ref, reactive} from 'vue';
import safeGet from "@fengqiaogang/safe-get";
import {onCreate} from "src/utils/textResource";
import Pagination from "src/components/page/index.vue";
import {API_BASE, TOKEN_KEY, TOKEN_NAME} from "src/config";
import Authorization from "src/libs/http/config/authorization";
import {Table, Form, FormItem, InputSearch, Button, Upload, message} from "ant-design-vue";


import type { UploadChangeParam, UploadProps } from "ant-design-vue";

const props = defineProps({
  versionId: {
    type: [String, Number],
    required: false,
  },
  projectId: {
    type: [String, Number],
    required: true,
  }
});


class FormState {
  searchValue?: string;
  versionId?: number;

  constructor() {
    if (props.versionId) {
      this.versionId = Number(props.versionId);
    }
  }
}

const pageSize = ref<number>(10);
const pageNumber = ref<number>(1);
const formState = reactive<FormState>(new FormState());
const textExportTemplate = ref<string>(`${API_BASE}project/text/export/textTmp`);
const textUploadResource = ref<string>(`${API_BASE}eci-comic/project/text/upload/textResource`);


const columns = [
  {title: "关联项目", dataIndex: 'projectName', key: 'projectName'},
  {title: "关联版本", dataIndex: 'versionName', key: 'versionName'},
  {title: "原文", dataIndex: 'originalText', key: 'originalText'},
  {title: "建议译文", dataIndex: 'translationText', key: 'translationText'},
  {title: " 类别", dataIndex: 'typeName', key: 'textName'},
  {title: " 备注", dataIndex: 'remark', key: 'remark'},
  {title: "创建人", dataIndex: 'createBy', key: 'createBy', align: "center"},
  {title: "创建时间", dataIndex: 'createTime', key: 'createTime', align: "center"},
  {title: "操作", dataIndex: 'id', key: 'action', align: "center"},
];


const {state, execute: onLoad, isLoading} = model.list<object>(function () {
  return api.knowLedge.textList(pageNumber.value, props.projectId, formState.versionId, formState.searchValue, pageSize.value);
}, new model.PageResult<object>([]), true);


const onSearch = () => {
  pageNumber.value = 1;
  onLoad(100);
}

const changePage = () => onLoad(100);


const fileList = ref([]);
const uploadData = computed(function () {
  return {'projectId': props.projectId};
});


const headers = computed(function () {
  const header = Authorization(TOKEN_KEY, TOKEN_NAME);
  return {
    [TOKEN_NAME]: safeGet<string>(header, "Authorization")
  };
});


const nweTextRource = async function () {
  const status = await onCreate(props.projectId as number);
  if (status) {
    await onLoad(100);
  }
}

const handleChange = (info: UploadChangeParam) => {
  if (info.code != 200) {
    message.error(info.msg);
  } else {
    message.success(info.msg);
    onLoad(100);
  }
  fileList.value = []
  return
};

const beforeUpload = (file: File) => {
  const isJpgOrPng = file.name.indexOf('xlsx') > -1;
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
    <Form layout="inline" :model="formState">
      <FormItem>
        <Version class="w-50" v-model:value="formState.versionId" :project-id="projectId"></Version>
      </FormItem>
      <FormItem>
        <InputSearch v-model:value="formState.searchValue" :allow-clear="true" placeholder="请输入条件" enter-button
                     @search="onSearch"
                     class="w-100 float-left"/>
      </FormItem>
      <FormItem class="ml-3">
        <a class="inline-block" :href="textExportTemplate">
          <Button type="primary" class="bg-neutral-600">导出</Button>
        </a>
      </FormItem>
      <FormItem class="ml-3">
        <Upload
            v-model:file-list="fileList"
            name="file"
            :action="textUploadResource"
            :headers="headers"
            :data="uploadData"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            @success="handleChange"
        >
          <Button type="primary" class="bg-violet-600">导入</Button>
        </Upload>
      </FormItem>
      <FormItem class="ml-3">
        <Button type="primary" class="bg-blue-600" @click="nweTextRource">新增</Button>
      </FormItem>

    </Form>

    <Table class="mt-5"
           :loading="isLoading"
           :data-source="state.results"
           :pagination="false"
           :columns="columns"
           :bordered="true">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.key === 'action'">
          <span class="inline-block">
            <Icon class="text-xl text-primary cursor-pointer" type="edit-square"></Icon>
          </span>
        </template>
      </template>
    </Table>
    <Pagination v-model:page="pageNumber" v-model:size="pageSize" :total="state.total" @click="changePage"></Pagination>
  </div>

</template>