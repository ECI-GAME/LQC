<script setup lang="ts">
/**
 * @file 知识库
 */

import api from "src/api";
import {Icon} from "@ue/icon";
import {onMounted} from 'vue';
import Search from "./search.vue";
import * as model from "src/utils/model";
import safeGet from "@fengqiaogang/safe-get";
import {FileData} from "src/utils/upload/common";
import Upload from "src/components/upload/index.vue";
import Pagination from "src/components/page/index.vue";
import {downloadFile} from "src/utils/brower/download";
import {useCommon, fileColumns, onRemove} from "./common";
import {Table, Form, FormItem, InputSearch, Button, Space} from "ant-design-vue";

const resourceType = "1";
const {versionId, projectId, isShowProject, pageSize, pageNumber, isUploading, fromData} = useCommon();

const {state, execute: onLoad, isLoading} = model.list<object>(function () {
  if (projectId.value) {
    return api.knowLedge.list(pageNumber.value, projectId.value, versionId.value, fromData.value.searchValue, resourceType, pageSize.value);
  }
  return new model.PageResult<object>([]);
});


const onSearch = () => {
  pageNumber.value = 1;
  onLoad(300);
}

const changePage = () => onLoad(100);

//文件上传
const onSuccess = async function (files: FileData[]) {
  const fileInfo = files.map(function (item: FileData) {
    return {
      resourceType,
      filePath: item.src,
      fileSize: item.size,
      fileType: item.type,
      fileName: item.fileName,
      projectId: projectId.value,
      versionId: versionId.value || 0,
    };
  });
  const status = await api.project.addKnowLedgeInfo(fileInfo);
  if (status) {
    await onLoad(100);
  }
}

const onRemoveFile = async function (data: object) {
  let status = await onRemove(data);
  if (status) {
    await onLoad(100);
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
                     placeholder="请输入名称"
                     :enter-button="true"
                     :allow-clear="true"
                     @search="onSearch"
                     class="w-100 deep-[.anticon-search]:flex"/>
      </FormItem>
      <FormItem>
        <Upload :multiple="true"
                @success="onSuccess"
                class="ml-3"
                v-model:loading="isUploading">
          <Button :loading="isUploading">
            <Space>
              <Icon class="flex text-base" type="cloud-upload"></Icon>
              <span>资源上传</span>
            </Space>
          </Button>
        </Upload>
      </FormItem>
    </Form>

    <Table class="mt-5"
           :loading="isLoading"
           :data-source="state.results" g
           :columns="fileColumns"
           :bordered="true"
           :pagination="false">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.key === 'action'">
          <Space>
            <Button class="p-0" type="link" title="编辑" @click="downloadFile(record.filePath)">
              <Icon class="text-xl text-primary cursor-pointer" type="download"></Icon>
            </Button>
            <Button class="p-0" type="link" title="删除" :danger="true" @click="onRemoveFile(record)">
              <Icon class="text-xl" type="delete"></Icon>
            </Button>
          </Space>
        </template>
      </template>
    </Table>
    <Pagination v-model:page="pageNumber" v-model:size="pageSize" :total="state.total" @click="changePage"></Pagination>
  </div>
</template>