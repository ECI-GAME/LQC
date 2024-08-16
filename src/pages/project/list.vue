<script setup lang="ts">
import api from "src/api";
import {Icon} from "@ue/icon";
import {RouterLink} from "vue-router";
import * as model from "src/utils/model";
import * as alias from "src/router/alias";
import {Table, Button,InputSearch,Pagination} from "ant-design-vue";
import {onCreate} from "src/utils/project";
import { ref } from 'vue';


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
    
    return  api.project.list(pageNumber.value,searchValue.value);
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

const editFrom = async function (data:object) {
  const status = await onCreate(data);

  if (status) {
    onLoad(100);
  }
}
const languageInfos = ref([]);
const fetchLanguageInfo = async () => {
  try {
    languageInfos.value = await api.system.getDictData('comic_language_type');
  } catch (error) {
    console.error("Failed to fetch language:", error);
  }
};
fetchLanguageInfo()
//语言映射
const changeLanguage = function(source:String){
 
  for (const element of languageInfos.value) {
    if (source === element.code) {
      return element.dictLabel;
    }
  
  }
  return '-';
}
const onSearch = function(){
  onLoad()
}
const searchValue = ref<string>('');

const changePage = function(page){
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
    <Table class="mt-5" :loading="isLoading" :pagination="false" :data-source="state.results" :columns="columns" :bordered="true">
      <template #bodyCell="{ column, text, record  }">
        <template v-if="column.key === 'projectName'">
          <RouterLink :to="{ name: alias.ProjectDetails.name, params: { projectId: record.id } }"> 
          <!-- <RouterLink :to="{ name: alias.versionImage.name, params: { projectId: projectId } }"></RouterLink> -->
            <Button type="link">{{ text }}</Button>
          </RouterLink>
        </template>
        <template v-if="column.key === 'languageInfo'">
          {{changeLanguage(record.sourceLanguage)}}->{{changeLanguage(record.sourceLanguage)}}
        </template>
        <template v-else-if="column.key === 'action'">
          <span class="inline-block">
            <Icon class="text-xl text-primary cursor-pointer" type="edit-square" @click="editFrom(record)"></Icon>
          </span>
        </template>
      </template>
    </Table>
    <br/>
    <Pagination v-model:current="pageNumber" class="float-right" :total="state.total" show-less-items @change="changePage" :show-total="total => `共 ${state.total} 条`"/>
  </div>
</template>