<script setup lang="ts">
/**
 * @file 知识库
 */
import {ref} from 'vue';
import api from "src/api";
import * as model from "src/utils/model";
import Version from "./comp/version.vue";
import {FileData} from "src/utils/upload/common";
import Upload from "src/components/upload/index.vue";
import Pagination from "src/components/page/index.vue";
import {Form, FormItem, InputSearch, Button, message, Card, Image, Row, Col, Empty} from "ant-design-vue";

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

const {state, execute: onLoad} = model.list<object>(function () {
  return api.knowLedge.list(pageNumber.value, props.projectId, fromData.value.versionId, fromData.value.searchValue, "2", pageSize.value);
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
      'versionId': fromData.value.versionId || 0,
      "resourceType": '2'
    })
  })
  message.success("上传成功")
  api.project.addKnowLedgeInfo(fileInfo);
  fileInfo = []
  onSearch();
}
const formatImageName = (imageName: string) => {
  return imageName.length > 10 ? imageName.substring(0, 10) + '...' : imageName;
};

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
      <Card class="mt-5">
        <Row>
          <Col :span="3" v-for="item in state.results">
            <Card style="width:150px" class="mb-5">
              <Image
                  style="margin-left:5px ;height: 150px; width: auto; display: flex;flex-wrap: wrap;justify-content: flex-start;"
                  :src="item.filePath"/>
              <span>{{ formatImageName(item.fileName) }}</span>
            </Card>
          </Col>

        </Row>
      </Card>

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