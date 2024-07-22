<script setup lang="ts">
import { Icon } from "@ue/icon";
import * as alias from "src/router/alias";
import {Table, Button} from "ant-design-vue";

const columns = [
  {title: "版本名称", dataIndex: 'name', key: 'name'},
  {title: "语言对", dataIndex: 'language', key: 'language', align: "center"},
  {title: "状态", dataIndex: 'status', key: 'status', align: "center"},
  {title: "时间区域", dataIndex: 'time', key: 'time', align: "center"},
  {title: "版本进度", dataIndex: 'progress', key: 'progress', align: "center"},
  {title: "操作", dataIndex: 'id', key: 'action', align: "right"},
];

const data = [
  {
    name: "第一个版本",
    language: "XXX - XXX",
    status: "进行中",
    time: "2024-07-22",
    progress: 30,
    id: "1"
  }
];

</script>

<template>
  <div>
    <Table :data-source="data" :columns="columns" :bordered="true">
      <template #bodyCell="{ column, text, record  }">
        <template v-if="column.key === 'name'">
          <RouterLink :to="{ name: alias.ProjectVersion.name, params: { versionId: record.id } }">
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