<script setup lang="ts">
/**
 * @file 任务明细
 */

import {Icon} from "@ue/icon";
import {RouterLink} from "vue-router";
import * as alias from "src/router/alias";
import {Table, Button, Card, Space} from "ant-design-vue";

const columns = [
  {title: "图片名称", dataIndex: 'name', key: 'name'},
  {title: "状态", dataIndex: 'status', key: 'status', align: "center"},
  {title: "处理人", dataIndex: 'personnel', key: 'personnel', align: "center"},
  {title: "上一节点", dataIndex: 'upstreamNode', key: 'upstreamNode', align: "center"},
  {title: "上一节点处理人", dataIndex: 'upstreamPersonnel', key: 'upstreamPersonnel', align: "center"},
  {title: "创建时间", dataIndex: 'createTime', key: 'time', align: "center"},
  {title: "最近处理时间", dataIndex: 'updateTime', key: 'time', align: "center"},
  {title: "操作", dataIndex: 'fileId', key: 'action', align: "right"},
];

const data = [
  {
    name: "xxx.jpg",
    status: "TEP",
    personnel: "Mary",
    upstreamNode: "任务创建",
    upstreamPersonnel: "Mary",
    createTime: "2024-07-24 10:00:00",
    updateTime: "2024-07-24 10:00:00",
    fileId: "1",      // 文件ID
    taskId: "1",      // 任务ID
    projectId: "1",   // 项目ID
  }
];

</script>

<template>
  <div>
    <Card>
      <Space size="large">
        <Button>批量下载</Button>
      </Space>
    </Card>

    <Card class="mt-5">
      <Table :data-source="data" :columns="columns" :bordered="true">
        <template #bodyCell="{ column, text, record  }">
          <template v-if="column.key === 'name'">
            <RouterLink :to="{ name: alias.Work.name, params:{ workId: record.fileId } }">
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
    </Card>
  </div>
</template>