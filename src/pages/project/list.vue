<script setup lang="ts">
import {ref} from 'vue';
import api from "src/api";
import {Icon} from "@ue/icon";
import {RouterLink} from "vue-router";
import * as model from "src/utils/model";
import * as alias from "src/router/alias";
import LanguageDetail from "src/components/language/detail.vue";
import {Table, Button, InputSearch, Pagination} from "ant-design-vue";
import {onCreate} from "src/utils/project";

const pageNumber = ref(1)
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
const {state, execute: onLoad, isLoading} = model.list<object>(
  function () {

    return api.project.list(pageNumber.value, searchValue.value);
  },
  new model.PageResult<object>([]),
  true
);

const onCreateProject = async function () {
  const status = await onCreate();

  if (status) {
    onLoad(100);
  }
}

const editFrom = async function (data: object) {
  const status = await onCreate(data);

  if (status) {
    onLoad(100);
  }
}

const onSearch = function () {
  onLoad()
}
const searchValue = ref<string>('');
const changePage = function (page: number) {
  pageNumber.value = page
  onLoad()
}
</script>

<template>
  <div>
    <div class="text-right">
      <InputSearch
          v-model:value="searchValue"
          placeholder="请输入条件"
          enter-button
          @search="onSearch"
          class="w-100 float-left"
      />
      <Button @click="onCreateProject">新建</Button>
    </div>
    <Table class="mt-5" :loading="isLoading" :pagination="false" :data-source="state.results" :columns="columns"
           :bordered="true">
      <template #bodyCell="{ column, text, record  }">
        <template v-if="column.key === 'projectName'">
          <RouterLink :to="{ name: alias.ProjectDetails.name, params: { projectId: record.id } }">
            <!-- <RouterLink :to="{ name: alias.versionImage.name, params: { projectId: projectId } }"></RouterLink> -->
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
    <br/>
    <Pagination v-model:current="pageNumber" class="float-right" :total="state.total" show-less-items
                @change="changePage" :show-total="total => `共 ${state.total} 条`"/>
  </div>
</template>