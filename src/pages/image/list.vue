<script setup lang="ts">
/**
 * @file 图片管理
 * @author svon.me@gmail.com
 */

import {ref} from "vue";
import api from "src/api";
import {Icon} from "@ue/icon";
import {columns} from "./config";
import Preview from "./preview.vue";
import * as model from "src/utils/model";
import * as alias from "src/router/alias";
import safeGet from "@fengqiaogang/safe-get";
import {RouterLink, useRoute} from "vue-router";
import Page from "src/components/page/index.vue";
import {FileData} from "src/utils/upload/common";
import Select from "src/components/dict/select.vue";
import Upload from "src/components/upload/index.vue";
import {Table, Button, Card, Form, FormItem, Input, Space, message, Popconfirm} from "ant-design-vue";


const route = useRoute();

class Search {
  pageNum: number = 1;
  pageSize: number = 20;
  versionId?: string | number;
  imageName?: string;
  projectId: string | number;

  constructor() {
    this.projectId = route.params.projectId as string;
  }
}

const search = ref<Search>(new Search());
const isOnLoading = ref<boolean>(false);

const confirmDelete = async function (rowInfo: object) {
  if (rowInfo.taskName != null || rowInfo.taskName != undefined) {
    message.warning('当前图片还有任务关联，请先取消关联关系!')
    return
  }

  await api.version.deleteImageByVid(rowInfo.id);
  onLoad(100)
}


let projectInfo = {};
const initVersioInfos = async () => {
  try {
    projectInfo.value = await api.project.getProjectInfoById(route.params.projectId);
  } catch (error) {
    console.error("Failed to fetch task status:", error);
  }
};
initVersioInfos()

const {state, execute: onLoad, isLoading} = model.list<object>(function () {
  return api.version.geVersionImageDetailPage(
    search.value.versionId,
    search.value.projectId,
    search.value.pageNum,
    search.value.pageSize,
    search.value.imageName
  )
});


let fileInfo: any[] = [];
const onSuccess = async function (files: FileData[]) {
  var imageCName = '';
  let allImagesValid = true;
  for (const s of files) {
    const res = await api.version.checkImage(search.value.versionId!, s.fileName);
    if (res > 0) {
      imageCName = s.fileName;
      message.error("文件名称重复，请重命名：" + imageCName);
      allImagesValid = false;
      break;
    }

    fileInfo.push({
      'imageName': s.fileName,
      'imageSize': s.size,
      'originalImagePath': s.src,
      'imageType': s.type,
      'projectNum': projectInfo.value.projectNum,
      'versionId': fromData.value.versionId || ""
    });
  }

  if (allImagesValid && fileInfo.length === files.length) {
    message.success("上传成功");
    await api.version.addVersionImage(fileInfo);
    fileInfo = []
    onLoad(100);

  }
}

const onSearch = function () {
  onLoad(100)
}

const onReset = function () {
  const tmp = new Search();
  tmp.versionId = search.value.versionId;
  search.value = tmp;
  onSearch();
}

const fieldNames = {
  label: "verisonName",
  value: "versionId"
};
const getVersionList = async function () {
  if (search.value.projectId) {
    const res = await api.project.getVersionDict(search.value.projectId);
    const versionId = safeGet<string | number>(res, "results[0].versionId");
    if (versionId) {
      const tmp = new Search();
      tmp.versionId = versionId;
      search.value = tmp;
      setTimeout(onSearch);
    }
    return res;
  }
  return void 0;
}
</script>

<template>
  <div>
    <Card>
      <Form layout="inline">
        <FormItem label="画册">
          <div class="w-50">
            <Select v-model:value="search.versionId"
                    placeholder="请选择画册"
                    :field-names="fieldNames"
                    :options="getVersionList"></Select>
          </div>
        </FormItem>
        <FormItem label="图片名称">
          <Input v-model:value="search.imageName" :allow-clear="true"/>
        </FormItem>
        <FormItem>
          <Space>
            <Button type="primary" @click="onSearch">
              <Space>
                <Icon class="flex text-base" type="search"></Icon>
                <span>搜索</span>
              </Space>
            </Button>
            <Button @click="onReset">
              <Space>
                <Icon class="flex text-base" type="redo"></Icon>
                <span>重置</span>
              </Space>
            </Button>
          </Space>
        </FormItem>
      </Form>
    </Card>

    <Card class="mt-5">
      <Space size="large">
        <Upload :multiple="true" @success="onSuccess" v-model:loading="isOnLoading">
          <Button :loading="isOnLoading" :disabled="!search.versionId">
            <Space>
              <Icon class="flex text-base" type="cloud-upload"></Icon>
              <span>图片上传</span>
            </Space>
          </Button>
        </Upload>
      </Space>
    </Card>

    <Card class="mt-5">
      <Table v-if="state" :data-source="state.results" :pagination="false" :columns="columns" :loading="isLoading"
             :bordered="true">
        <template #bodyCell="{ column, text, record  }">
          <template v-if="column.key === 'name'">
            <RouterLink
                :to="{ name: alias.TaskDetails.name, params:{ projectId: record.projectId, taskId: record.id } }">
              <Button type="link">{{ text }}</Button>
            </RouterLink>
          </template>
          <Preview v-else-if="column.key === 'preview'" :value="text" :type="column.dataIndex" :id="record.id"></Preview>
          <template v-else-if="column.key === 'action'">
          <span class="inline-block">
            <Popconfirm
                title="确认需要删除当前图片信息吗?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="confirmDelete(record)"
            >
              <Icon class="text-xl text-primary cursor-pointer" type="delete"></Icon>
            </Popconfirm>
            
          </span>
          </template>
        </template>
      </Table>
      <Page :total="state.total" v-model:page="search.pageNum" :size="search.pageSize" @click="onSearch"></Page>
    </Card>
  </div>
</template>