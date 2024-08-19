<script setup lang="ts">
import { Icon } from "@ue/icon";
import * as alias from "src/router/alias";
import {Table, Button} from "ant-design-vue";
import * as model from "src/utils/model";
import { useRoute } from 'vue-router';
import { ref } from 'vue';

import api from "src/api";
import {Progress,Pagination} from "ant-design-vue";


const route = useRoute();
const projectId = route.params.projectId;
const pageNumber = ref(1)
const columns = [
  {title: "画册名称", dataIndex: 'versionName', key: 'versionName'},
  {title: "语言对", dataIndex: 'languagePair', key: 'languagePair', align: "center"},
  {title: "状态", dataIndex: 'status', key: 'status', align: "center"},
  {title: "时间区域", dataIndex: 'dateInterval', key: 'dateInterval', align: "center"},
  {title: "画册进度", dataIndex: 'doneCnt', key: 'doneCnt', align: "center"},
  {title: "操作", dataIndex: 'id', key: 'action', align: "right"},
];

// 构造当前列表数据对象
const {state, execute: onLoad, isLoading} = model.list<object>(
  // 执行逻辑
  function () {
    return api.version.list(pageNumber.value,projectId);
  },
  // 默认值，为空时自动创建
  new model.PageResult<object>([]),
  // 是否默认执行，默认为 false
  
  true
);


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
const changePariLanguage = (source: string) => {
  const [sourceLang, targetLang] = source.split("->");

  const findLabelByCode = (code: string) => {
    const language = languageInfos.value.find(element => element.code === code);
    return language ? language.dictLabel : '';
  };
  const sourceRet = findLabelByCode(sourceLang);
  const targetRet = findLabelByCode(targetLang);

  return `${sourceRet} -> ${targetRet}`;
};

//进度计算
const changeProcess = function(doneCount: number,allCount: number){
  return (doneCount/allCount)*100;
}

const changePage = function(page){
  pageNumber.value = page
  onLoad()
}
</script>

<template>
  <div>
    <Table :data-source="state.results"  :pagination="false" :columns="columns" :bordered="true">
      <template #bodyCell="{ column, text, record  }">
        <template v-if="column.key === 'versionName'">
          <RouterLink :to="{ name: alias.TaskList.name, params: { projectId:projectId,versionId: record.id } }">
            <Button type="link">{{ record.versionName }}</Button>
          </RouterLink>
        </template>
        <template v-else-if="column.key === 'languagePair'">
          {{changePariLanguage(record.languagePair)}}
        </template>
        <template v-else-if="column.key === 'doneCnt'">
            <Progress :percent="changeProcess(record.doneCnt,record.totalCnt)" status="active" :showInfo="true" :format="percent => `${record.doneCnt} /${record.totalCnt}`" />
          </template>
        <template v-else-if="column.key === 'action'">
          <span class="inline-block">
            <Icon class="text-xl text-primary cursor-pointer" type="edit-square"></Icon>
          </span>
        </template>
      </template>
    </Table>
    <br/>
    <Pagination v-model:current="pageNumber" :defaultPageSize="3" class="float-right" :total="state.total" show-less-items @change="changePage" :show-total="total => `共 ${state.total} 条`"/>

  </div>
</template>