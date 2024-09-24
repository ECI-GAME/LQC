<script setup lang="ts">
/**
 * @file 项目列表
 * @author svon.me@gmail.com
 **/

import {ref} from 'vue';
import api from "src/api";
import {Icon} from "@ue/icon";
import {RouterLink} from "vue-router";
import * as model from "src/utils/model";
import * as alias from "src/router/alias";
import {useProject} from "src/utils/project";
import Page from "src/components/page/index.vue";
import LanguageDetail from "src/components/language/detail.vue";
import {Table, Button, InputSearch} from "ant-design-vue";
import {PlusOutlined} from "@ant-design/icons-vue";


import type {Project} from 'src/types';

const searchValue = ref<string>();
const pageNumber = ref<number>(1);
const {create: onCreate, edit: onEdit} = useProject();

const columns = [
  {title: "项目名称", dataIndex: 'projectName', key: 'projectName'},
  {title: "项目编号", dataIndex: 'projectNum', key: 'projectNum'},
  {title: "发行商", dataIndex: 'comicPublisher', key: 'comicPublisher', align: "center"},
  {title: "语言对", dataIndex: 'languageInfo', key: 'languageInfo', align: "center"},
  {title: "创建时间", dataIndex: 'createTime', key: 'createTime', align: "center"},
  {title: "当前画册", dataIndex: 'versionName', key: 'versionName', align: "center"},
  {title: "已进行时长(H)", dataIndex: 'timeCount', key: 'timeCount', align: "center"},
  {title: "PM", dataIndex: 'createUserName', key: 'createUserName', align: "center"},
  {title: "Actions", dataIndex: 'id', key: 'action', align: "right"},
];

const {state, execute: onLoad, isLoading} = model.list<object>(function () {
  return api.project.list(pageNumber.value, searchValue.value);
}, new model.PageResult<object>([]), true);

const onSearch = function () {
  onLoad(100)
}

const onCreateProject = async function () {
  const status = await onCreate();
  if (status) {
    onSearch();
  }
}

const editFrom = async function (data: Project) {
  const status = await onEdit(data);
  if (status) {
    onSearch();
  }
}

</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <InputSearch
          v-model:value="searchValue"
          placeholder="请输入条件"
          enter-button
          @search="onSearch"
          class="w-100 deep-[.anticon-search]:flex"
      />
      <Button type="primary"  @click="onCreateProject">
        <template #icon>
          <PlusOutlined  class="my-0 inline-flex" />
        </template>
        <span>新建</span>
      </Button>
    </div>

    <Table class="mt-5" :loading="isLoading" :pagination="false" :data-source="state.results" :columns="columns"
           :bordered="true">
      <template #bodyCell="{ column, text, record  }">
        <template v-if="column.key === 'projectName'">
          <RouterLink :to="{ name: alias.ProjectDetails.name, params: { projectId: record.id } }">
            <Button type="link">{{ text }}</Button>
          </RouterLink>
        </template>
        <template v-if="column.key === 'languageInfo'">
          <LanguageDetail :value="record"></LanguageDetail>
        </template>
        <template v-else-if="column.key === 'action'">
          <span class="inline-block">
            <Icon class="text-xl text-primary cursor-pointer" type="edit-square" @click="editFrom(record)"></Icon>
          </span>
        </template>
      </template>
    </Table>

    <Page v-model:page="pageNumber" :total="state.total" @click="onSearch"></Page>
  </div>
</template>
