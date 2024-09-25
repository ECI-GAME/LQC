<script setup lang="ts">
/**
 * @file 知识库
 */
import api from "src/api";
import {Icon} from "@ue/icon";
import {onMounted} from 'vue';
import Search from "./search.vue";
import {useCommon} from "./common";
import * as model from "src/utils/model";
import {ElImage as Image} from "element-plus";
import {FileData} from "src/utils/upload/common";
import Upload from "src/components/upload/index.vue";
import Pagination from "src/components/page/index.vue";
import {Form, FormItem, InputSearch, Button, Space, Card, Empty} from "ant-design-vue";

import type {ProjectImage} from "src/types";

const resourceType = "2";
const {versionId, projectId, isShowProject, pageSize, pageNumber, isUploading, fromData} = useCommon();

const {state, execute: onLoad} = model.list<ProjectImage>(function () {
  if (projectId.value) {
    return api.knowLedge.list<ProjectImage>(pageNumber.value, projectId.value, versionId.value, fromData.value.searchValue, resourceType, pageSize.value);
  }
  return new model.PageResult<ProjectImage>([]);
});

const onSearch = () => {
  pageNumber.value = 1;
  onLoad(300);
}

const changePage = () => onLoad(100);

const getPreviewList = function (list: ProjectImage[]): string[] {
  return list.map((item: ProjectImage) => item.filePath);
}

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
                     placeholder="请输入名称"
                     :enter-button="true"
                     :allow-clear="true"
                     @search="onSearch"
                     class="w-100 deep-[.anticon-search]:flex"/>
      </FormItem>
      <FormItem>
        <Upload :multiple="true" @success="onSuccess" accept="image/*" v-model:loading="isUploading">
          <Button :loading="isUploading">
            <Space>
              <Icon class="flex text-base" type="cloud-upload"></Icon>
              <span>图片上传</span>
            </Space>
          </Button>
        </Upload>
      </FormItem>
    </Form>

    <template v-if="state.total > 0">
      <div class="clearfix">
        <div class="mt-5 float-left w-60" v-for="(item, index) in state.results" :key="item.fileId">
          <div class="h-70 mr-5 rounded-md overflow-hidden">
            <Image class="w-full h-full"
                   :src="item.filePath"
                   fit="cover"
                   crossorigin="anonymous"
                   :initial-index="index"
                   :preview-teleported="true"
                   :preview-src-list="getPreviewList(state.results)"/>
          </div>
          <div class="text-center pt-1">{{ item.fileName }}</div>
        </div>
      </div>
      <Pagination v-model:page="pageNumber" v-model:size="pageSize" :total="state.total"
                  @click="changePage"></Pagination>
    </template>
    <Card class="mt-5" v-else>
      <div class="py-10">
        <Empty></Empty>
      </div>
    </Card>
  </div>

</template>