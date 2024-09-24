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
import Tags from "src/components/ue/tag.vue";
import * as model from "src/utils/model";
import * as alias from "src/router/alias";
import safeGet from "@fengqiaogang/safe-get";
import {RouterLink, useRoute} from "vue-router";
import Page from "src/components/page/index.vue";
import {FileData} from "src/utils/upload/common";
import Dict from "src/components/dict/index.vue";
import Select from "src/components/dict/select.vue";
import Upload from "src/components/upload/index.vue";
import {Table, Button, Card, Form, FormItem, Input, Space, message, Popconfirm} from "ant-design-vue";

import type {Project} from "src/types";

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


// 项目详情
const {state: project} = model.result<Project>(function () {
  return api.project.getProjectInfoById(search.value.projectId);
}, {} as Project, true);

// 图片列表
const {state, execute: onLoad, isLoading} = model.list<object>(function () {
  return api.version.geVersionImageDetailPage(
    search.value.versionId,
    search.value.projectId,
    search.value.pageNum,
    search.value.pageSize,
    search.value.imageName
  )
});

// 文件上传入库
const onUploadSuccess = async function (files: FileData[]) {
  const list = files.map(function (item: FileData) {
    return {
      imageName: item.fileName,
      imageSize: item.size,
      originalImagePath: item.src,
      imageType: item.type,
      projectNum: project.value.projectNum,
      versionId: search.value.versionId,
    };
  });
  let status: boolean = false;
  if (list.length > 0) {
    status = await api.version.addVersionImage(list)
  }
  if (status) {
    onReset();
  }
}

// 检测文件石佛上传过
const onFileAccept = function (file: File): boolean | Promise<boolean> {
  const versionId = search.value.versionId;
  if (versionId) {
    return api.version.checkImage(versionId, file.name);
  }
  return false;
}

// 搜索
const onSearch = function () {
  return onLoad(100)
}
// 重置
const onReset = function () {
  const tmp = new Search();
  tmp.versionId = search.value.versionId;
  search.value = tmp;
  onSearch();
}

// 删除图片
const confirmDelete = async function (data: object) {
  const taskName = safeGet<string>(data, "taskName");
  if (taskName) {
    message.warning('当前图片还有任务关联，请先取消关联关系!');
    return;
  }
  let status: boolean = false;
  const id = safeGet<string | number>(data, "id");
  if (id) {
    status = await api.version.deleteImageByVid(id);
  }
  if (status) {
    await onSearch();
  }
}

const fieldNames = {label: "verisonName", value: "versionId"};
// 版本列表
const getVersionList = async function () {
  if (search.value.projectId) {
    const res = await api.project.getVersionDict(search.value.projectId);
    const versionId = safeGet<string | number>(res.results, `[0].${fieldNames.value}`);
    if (versionId) {
      // 设置默认值
      const tmp = new Search();
      tmp.versionId = versionId;
      search.value = tmp;
      // 加载图片列表数据
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
      <div class="flex justify-between items-center">
        <Form layout="inline">
          <FormItem label="画册">
            <div class="w-50">
              <Select v-model:value="search.versionId" placeholder="请选择画册" :field-names="fieldNames"
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

        <Upload :multiple="true" :accept="onFileAccept" @success="onUploadSuccess" v-model:loading="isOnLoading"
                :disabled="!project.projectNum">
          <Button type="primary" :loading="isOnLoading" :disabled="!search.versionId">
            <Space>
              <Icon class="flex text-base" type="cloud-upload"></Icon>
              <span>图片上传</span>
            </Space>
          </Button>
        </Upload>
      </div>
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
          <Preview v-else-if="column.key === 'preview'" :value="text" :type="column.dataIndex"
                   :id="record.id"></Preview>
          <Dict v-else-if="column.key === 'imageStatus'" type="comic_task_status" :value="text" auto-value="--"></Dict>
          <Tags v-else-if="column.key === 'handlerName'" :value="text"></Tags>
          <template v-else-if="column.key === 'action'">
          <span class="inline-block">
            <Popconfirm
                title="确认需要删除当前图片信息吗?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="confirmDelete(record)"
            >
              <Button class="p-0" type="link" title="删除画册" :danger="true">
                <Icon class="text-xl" type="delete"></Icon>
              </Button>
            </Popconfirm>
            
          </span>
          </template>
        </template>
      </Table>
      <Page :total="state.total" v-model:page="search.pageNum" :size="search.pageSize" @click="onSearch"></Page>
    </Card>
  </div>
</template>