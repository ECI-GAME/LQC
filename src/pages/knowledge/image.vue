<script setup lang="ts">
/**
 * @file 知识库
 */
import {ref} from 'vue';
import api from "src/api";
import * as model from "src/utils/model";
import Version from "./comp/version.vue";
import {ElImage as Image} from "element-plus";
import {FileData} from "src/utils/upload/common";
import Upload from "src/components/upload/index.vue";
import Pagination from "src/components/page/index.vue";
import {Form, FormItem, InputSearch, Button, message, Card, Empty} from "ant-design-vue";

import type {ProjectImage} from "src/types";

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


let fileInfo: any[] = [];
const isOnloading = ref<boolean>(false);
const fromData = ref<FormState>(new FormState());
const pageSize = ref<number>(10);
const pageNumber = ref<number>(1);

const {state, execute: onLoad} = model.list<ProjectImage>(function () {
  return api.knowLedge.list<ProjectImage>(pageNumber.value, props.projectId, fromData.value.versionId, fromData.value.searchValue, "2", pageSize.value);
}, new model.PageResult<ProjectImage>([]), true);

const onSearch = () => {
  pageNumber.value = 1;
  onLoad(100);
}

const changePage = () => onLoad(100);

const getPreviewList = function (list: ProjectImage[]): string[] {
  return list.map((item: ProjectImage) => item.filePath);
}

//文件上传
const onSuccess = async function (files: FileData[]) {
  files.forEach(s => {
    fileInfo.push({
      'fileName': s.fileName,
      'fileSize': s.size,
      'filePath': s.src,
      'fileType': s.type,
      'projectId': props.projectId,
      'versionId': fromData.value.versionId || 0,
      "resourceType": '2'
    })
  })
  message.success("上传成功")
  api.project.addKnowLedgeInfo(fileInfo);
  fileInfo = []
  onSearch();
}

</script>
<template>
  <div>
    <Form layout="inline" :model="fromData">
      <FormItem v-if="!props.versionId">
        <Version class="w-50" v-model:value="fromData.versionId" :project-id="projectId"></Version>
      </FormItem>
      <FormItem>
        <InputSearch v-model:value="fromData.searchValue" placeholder="请输入条件" enter-button allow-clear
                     @search="onSearch" class="w-100 float-left"/>
      </FormItem>
      <FormItem>
        <Upload :multiple="true" @success="onSuccess" class="ml-3" v-model:loading="isOnloading">
          <Button :loading="isOnloading">图片上传</Button>
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