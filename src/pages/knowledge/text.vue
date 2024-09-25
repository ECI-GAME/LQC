<!--文本-->
<script setup lang="ts">
/**
 * @file 知识库 - 文本
 * @author svon.me@gmial.com
 */

import api from "src/api";
import {Icon} from "@ue/icon";
import Search from "./search.vue";
import {ref, onMounted} from 'vue';
import {API_BASE} from "src/config";
import * as model from "src/utils/model";
import onSure from "src/utils/tips/sure";
import Page from "src/components/page/index.vue";
import {onCreate, onEdit} from "./resource/text";
import Upload from "src/components/upload/index.vue";
import {downloadFile} from "src/utils/brower/download";
import {useCommon, textColumns, onFileAccept} from "./common";
import {Table, Form, FormItem, InputSearch, Button, Space} from "ant-design-vue";

import type {TextResource} from "src/types";

// 模板导出地址
const textExportTemplate = ref<string>(`${API_BASE}project/text/export/textTmp`);
// 构造公共数据
const {versionId, projectId, isShowProject, pageSize, pageNumber, fromData} = useCommon();
// 文本列表
const {state, execute: onLoad, isLoading} = model.list<TextResource>(function () {
  if (projectId.value) {
    return api.knowLedge.textList(pageNumber.value, projectId.value, versionId.value, fromData.value.searchValue, pageSize.value);
  }
  return new model.PageResult<TextResource>([]);
});
const onSearch = () => {
  pageNumber.value = 1;
  onLoad(100);
}
const onChangePage = function () {
  onLoad(100);
};

// 新增文本
const onCreateResource = async function () {
  const status = await onCreate(projectId.value!, versionId.value);
  if (status) {
    await onLoad(100);
  }
}

const onEditResource = async function (value: TextResource) {
  const status = await onEdit(value);
  if (status) {
    await onLoad(100);
  }
}

const onRemoveResource = async function (value: TextResource) {
  let status = await onSure("是否确认删除?");
  if (status) {
    status = await api.project.removeTextReource(value.id);
  }
  if (status) {
    await onLoad(100);
  }
}

// 文件上传
const onUploadFile = async function (value: File[]) {
  const file = value[0];
  const data = new FormData();
  data.append("file", file);
  data.append("projectId", String(projectId.value));
  const status = await api.project.importTextResource(data);
  if (status) {
    onSearch();
  }
}

onMounted(onSearch);

</script>
<template>
  <div>
    <Form layout="inline">
      <Search v-model:project-id="projectId"
              v-model:version-id="versionId"
              :is-project="isShowProject"></Search>
      <FormItem>
        <InputSearch v-model:value="fromData.searchValue"
                     :allow-clear="true"
                     placeholder="请输入条件"
                     :enter-button="true"
                     @search="onSearch"
                     class="w-100 deep-[.anticon-search]:flex"/>
      </FormItem>
      <FormItem class="ml-3">
        <Button @click="downloadFile(textExportTemplate)">
          <Space>
            <Icon class="flex text-base" type="cloud-download"></Icon>
            <span>模板下载</span>
          </Space>
        </Button>
      </FormItem>
      <FormItem class="ml-3">
        <Upload :disabled="!projectId" :action="onUploadFile" :accept="onFileAccept" :max-size="200">
          <Button :disabled="!projectId">
            <Space>
              <Icon class="flex text-base" type="cloud-upload"></Icon>
              <span>导入</span>
            </Space>
          </Button>
        </Upload>
      </FormItem>
      <FormItem class="ml-3">
        <Button @click="onCreateResource" :disabled="!projectId">
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
          <Space>
            <Button class="p-0" type="link" title="编辑" @click="onEditResource(record)">
              <Icon class="text-xl" type="edit-square"></Icon>
            </Button>
            <Button class="p-0" type="link" title="删除" :danger="true" @click="onRemoveResource(record)">
              <Icon class="text-xl" type="delete"></Icon>
            </Button>
          </Space>
        </template>
      </template>
    </Table>
    <Page v-model:page="pageNumber" v-model:size="pageSize" :total="state.total" @click="onChangePage"></Page>
  </div>

</template>