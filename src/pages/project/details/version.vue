<script setup lang="ts">
import {Icon} from "@ue/icon";
import * as alias from "src/router/alias";
import {Table, Button} from "ant-design-vue";
import * as model from "src/utils/model";
import {ref} from 'vue';
import Page from "src/components/page/index.vue";
import LanguagePair from "src/components/language/pair.vue";

import api from "src/api";
import {Progress, Pagination} from "ant-design-vue";
import {onCreate} from "src/utils/version";


const props = defineProps({
  projectId: {
    type: [String, Number],
    required: true,
  }
});

const pageNumber = ref(1)
const columns = [
  {title: "画册名称", dataIndex: 'versionName', key: 'versionName'},
  {title: "语言对", dataIndex: 'languagePair', key: 'languagePair', align: "center"},
  {title: "状态", dataIndex: 'status', key: 'status', align: "center"},
  {title: "时间区域", dataIndex: 'dateInterval', key: 'dateInterval', align: "center"},
  {title: "画册进度", dataIndex: 'doneCnt', key: 'doneCnt', align: "center"},
  {title: "操作", dataIndex: 'id', key: 'action', align: "center"},
];

// 构造当前列表数据对象
const {state, execute: onLoad} = model.list<object>(
  // 执行逻辑
  function () {
    return api.version.list(pageNumber.value, props.projectId);
  },
  // 默认值，为空时自动创建
  new model.PageResult<object>([]),
  // 是否默认执行，默认为 false
  true
);

//进度计算
const changeProcess = function (doneCount: number, allCount: number) {
  return (doneCount / allCount) * 100;
}

const changePage = function (page: Object) {
  
  pageNumber.value = page.pageNum
  onLoad()
}
const onUpdateVersion = async function (versionId:number) {
  console.log(state)
  // 创建项目
  const status = await onCreate(props.projectId as string,1,versionId);
  // 状态判断
  if (status) {
    window.location.reload();
  }
}
</script>

<template>
  <div>
    <Table :data-source="state.results" :pagination="false" :columns="columns" :bordered="true">
    
      <template #bodyCell="{ column, text, record  }">
        <template v-if="column.key === 'versionName'">
          <RouterLink :to="{ name: alias.TaskList.name, params: { projectId:projectId,versionId: record.id } }">
            <Button type="link">{{ text }}</Button>
          </RouterLink>
        </template>
        <template v-else-if="column.key === 'languagePair'">
          <LanguagePair :value="text"></LanguagePair>
        </template>
        <template v-else-if="column.key === 'doneCnt'">
          <Progress :percent="changeProcess(record.doneCnt,record.totalCnt)" status="active" :showInfo="true"
                    :format="percent => `${record.doneCnt} /${record.totalCnt}`"/>
        </template>
        <template v-else-if="column.key === 'action'">
          <span class="inline-block">
            <Icon class="text-xl text-primary cursor-pointer" @click="onUpdateVersion(record.id)" type="edit-square"></Icon>
          </span>
        </template>
      </template>
    </Table>
    <Page v-model:page="pageNumber" :size="3" :total="state.total" @click="changePage"></Page>
  </div>
</template>