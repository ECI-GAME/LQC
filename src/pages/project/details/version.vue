<script setup lang="ts">
import { Icon } from "@ue/icon";
import * as alias from "src/router/alias";
import {Table, Button} from "ant-design-vue";
import * as model from "src/utils/model";
import { useRoute } from 'vue-router';

import api from "src/api";

const route = useRoute();
const projectId = route.params.projectId;

const columns = [
  {title: "版本名称", dataIndex: 'versionName', key: 'versionName'},
  {title: "语言对", dataIndex: 'languagePair', key: 'languagePair', align: "center"},
  {title: "状态", dataIndex: 'status', key: 'status', align: "center"},
  {title: "时间区域", dataIndex: 'dateInterval', key: 'dateInterval', align: "center"},
  {title: "版本进度", dataIndex: 'doneCnt', key: 'doneCnt', align: "center"},
  {title: "操作", dataIndex: 'id', key: 'action', align: "right"},
];

// 构造当前列表数据对象
const {state, execute: onLoad, isLoading} = model.list<object>(
  // 执行逻辑
  function () {
    return api.version.list(1,projectId);
  },
  // 默认值，为空时自动创建
  new model.PageResult<object>([]),
  // 是否默认执行，默认为 false
  
  true
);
</script>

<template>
  <div>
    <Table :data-source="state.results" :columns="columns" :bordered="true">
      <template #bodyCell="{ column, text, record  }">
        <template v-if="column.key === 'name'">
          <RouterLink :to="{ name: alias.TaskList.name, params: { projectId: record.id } }">
            <Button type="link">{{ text }}</Button>
          </RouterLink>
        </template>
        <template v-else-if="column.key === 'action'">
          <span class="inline-block">
            <Icon class="text-xl text-primary cursor-pointer" type="edit-square"></Icon>
          </span>
        </template>
      </template>
    </Table>
  </div>
</template>