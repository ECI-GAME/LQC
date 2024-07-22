<script setup lang="ts">
import {Icon} from "@ue/icon";
import * as alias from "src/router/alias";
import {Table, Button, Card} from "ant-design-vue";

const columns = [
  {title: "名称", dataIndex: 'name', key: 'name'},
  {title: "状态", dataIndex: 'status', key: 'status', align: "center"},
  {title: "处理人", dataIndex: 'personnel', key: 'personnel', align: "center"},
  {title: "TEP 图片", dataIndex: 'tepImage', key: 'image', align: "center"},
  {title: "DTP 图片(PSD)", dataIndex: 'dtpImage', key: 'image', align: "center"},
  {title: "QA 图片", dataIndex: 'qaImage', key: 'image', align: "center"},
  {title: "归档图片", dataIndex: 'successImage', key: 'image', align: "center"},
  {title: "关联任务", dataIndex: 'task', key: 'task', align: "center"},
  {title: "操作", dataIndex: 'id', key: 'action', align: "right"},
];

const data = [
  {
    name: "XXX.png",
    status: "TEP",
    personnel: "Mary",
    tepImage: "",
    dtpImage: "",
    qaImage: "",
    successImage: "",
    id: "1"
  }
];

</script>

<template>
  <Card title="版本管理">
    <Table :data-source="data" :columns="columns" :bordered="true">
      <template #bodyCell="{ column, text, record  }">
        <template v-if="column.key === 'name'">
          <RouterLink :to="{ name: alias.ProjectVersion.name, params: { versionId: record.id } }">
            <Button type="link">{{ text }}</Button>
          </RouterLink>
        </template>
        <template v-else-if="column.key === 'image'">
          <Button v-if="text" type="link">预览</Button>
          <span v-else>待生成</span>
        </template>
        <template v-else-if="column.key === 'action'">
          <span class="inline-block">
            <Icon class="text-xl text-primary cursor-pointer" type="edit-square"></Icon>
          </span>
        </template>
      </template>
    </Table>
  </Card>
</template>