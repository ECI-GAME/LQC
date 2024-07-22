<script setup lang="ts">
import {Icon} from "@ue/icon";
import {RouterLink} from "vue-router";
import * as alias from "src/router/alias";
import {Table, Button} from "ant-design-vue";

const columns = [
  {title: "项目名称", dataIndex: 'projectName', key: 'projectName'},
  {title: "发行商", dataIndex: 'groupName', key: 'groupName', align: "center"},
  {title: "创建时间", dataIndex: 'createTime', key: 'createTime', align: "center"},
  {title: "当前版本", dataIndex: 'version', key: 'version', align: "center"},
  {title: "已进行时长(H)", dataIndex: 'runTime', key: 'runTime', align: "center"},
  {title: "PM", dataIndex: 'pm', key: 'pm', align: "center"},
  {title: "Actions", dataIndex: 'id', key: 'action', align: "right"},
];

const data = [
  {
    projectName: "测试项目",
    groupName: "测试公司",
    createTime: "2024-07-22 10:00:00",
    version: "V1.0.1",
    pm: "Root",
    id: "1"
  }
];

</script>

<template>
  <div>
    <Table :data-source="data" :columns="columns" :bordered="true">
      <template #bodyCell="{ column, text, record  }">
        <template v-if="column.key === 'projectName'">
          <RouterLink :to="{ name: alias.ProjectDetails.name, params: { projectId: record.id } }">
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