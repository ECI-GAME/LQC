<script setup lang="ts">
/**
 * @file 任务详情
 */
import {Icon} from "@ue/icon";
import {onCreate} from "./config";
import * as alias from "src/router/alias";
import {Table, Button, Card, Form, FormItem, Input, Space} from "ant-design-vue";

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

const onCreateTask = async function () {
  const res = await onCreate();
  console.log(res);
}

</script>

<template>
  <Card>
    <Form layout="inline">
      <FormItem label="任务名称">
        <Input/>
      </FormItem>
      <FormItem label="状态">
        <Input/>
      </FormItem>
      <FormItem label="处理人">
        <Input/>
      </FormItem>
      <FormItem>
        <template #label></template>
        <Space>
          <Button>搜索</Button>
          <Button>重置</Button>
        </Space>
      </FormItem>
    </Form>
  </Card>

  <Card class="mt-5">
    <Space size="large">
      <Button @click="onCreateTask">新建任务</Button>
      <Button>生成交付文件</Button>
      <Button>归档</Button>
    </Space>
  </Card>

  <Card class="mt-5">
    <Table :data-source="data" :columns="columns" :bordered="true">
      <template #bodyCell="{ column, text, record  }">
        <template v-if="column.key === 'name'">
          <Button type="link">{{ text }}</Button>
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