<!--文本-->
<script setup lang="ts">
/**
 * @file 知识库
 */


import api from "src/api";
import {Icon} from "@ue/icon";
import Search from "./search.vue";
import * as model from "src/utils/model";
import {useCommon, textColumns} from "./common";
import {computed, ref, onMounted} from 'vue';
import safeGet from "@fengqiaogang/safe-get";
import {onCreate} from "src/utils/textResource";
import Page from "src/components/page/index.vue";
import {API_BASE, TOKEN_KEY, TOKEN_NAME} from "src/config";
import Authorization from "src/libs/http/config/authorization";
import {Table, Form, FormItem, InputSearch, Button, Upload, message, Space} from "ant-design-vue";


import type {UploadChangeParam, UploadProps} from "ant-design-vue";


const textExportTemplate = ref<string>(`${API_BASE}project/text/export/textTmp`);
const textUploadResource = ref<string>(`${API_BASE}eci-comic/project/text/upload/textResource`);

const {versionId, projectId, isShowProject, pageSize, pageNumber, fromData} = useCommon();


const {state, execute: onLoad, isLoading} = model.list<object>(function () {
  if (projectId.value) {
    return api.knowLedge.textList(pageNumber.value, projectId.value, versionId.value, fromData.value.searchValue, pageSize.value);
  }
  return new model.PageResult<object>([]);
});


const onSearch = () => {
  pageNumber.value = 1;
  onLoad(100);
}

const changePage = () => onLoad(100);


const fileList = ref([]);
const uploadData = computed(function () {
  return {'projectId': projectId.value};
});


const headers = computed(function () {
  const header = Authorization(TOKEN_KEY, TOKEN_NAME);
  return {
    [TOKEN_NAME]: safeGet<string>(header, "Authorization")
  };
});


const nweTextRource = async function () {
  const status = await onCreate(projectId.value!);
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
  let status = false;
  if (file.name) {
    const reg = /\.xlsx$/i;
    status = reg.test(file.name);
  }
  if (!status) {
    message.error('仅支持xlsx格式文件上传!');
    return false
  }
  status = file.size / 1024 / 1024 < 200;
  if (!status) {
    message.error('上传附件必须小于200MB!');
    return false
  }
  return true;
};


onMounted(onSearch);

</script>
<template>
  <div>
    <Form layout="inline">
      <Search v-model:project-id="projectId"
              v-model:version-id="versionId"
              :is-project="isShowProject"></Search>
      <FormItem>
        <InputSearch v-model:value="fromData.searchValue" :allow-clear="true" placeholder="请输入条件" enter-button
                     @search="onSearch"
                     class="w-100 float-left"/>
      </FormItem>
      <FormItem class="ml-3">
        <a class="inline-block" :href="textExportTemplate">
          <Button>
            <Space>
              <Icon class="flex text-base" type="cloud-download"></Icon>
              <span>模板下载</span>
            </Space>
          </Button>
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
          <Button :disabled="!projectId">
            <Space>
              <Icon class="flex text-base" type="cloud-upload"></Icon>
              <span>导入</span>
            </Space>
          </Button>
        </Upload>
      </FormItem>
      <FormItem class="ml-3">
        <Button @click="nweTextRource" :disabled="!projectId">
          <Space>
            <Icon class="flex text-base" type="plus"></Icon>
            <span>新增</span>
          </Space>
        </Button>
      </FormItem>
    </Form>

    <Table class="mt-5"
           :loading="isLoading"
           :data-source="state.results"
           :pagination="false"
           :columns="textColumns"
           :bordered="true">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.key === 'action'">
          <span class="inline-block">
            <Icon class="text-xl text-primary cursor-pointer" type="edit-square"></Icon>
          </span>
        </template>
      </template>
    </Table>
    <Page v-model:page="pageNumber" v-model:size="pageSize" :total="state.total" @click="changePage"></Page>
  </div>

</template>