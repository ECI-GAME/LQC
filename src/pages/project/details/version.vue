<script setup lang="ts">
/**
 * @file 画册版本列表
 * @author svon.me@gmail.com
 **/

import {ref} from 'vue';
import api from "src/api";
import {Icon} from "@ue/icon";
import * as model from "src/utils/model";
import {Progress} from "ant-design-vue";
import * as alias from "src/router/alias";
import onSure from "src/utils/tips/sure";
import Page from "src/components/page/index.vue";
import {Table, Button, Space} from "ant-design-vue";
import {useImageAlbum, albumColumns} from "./common";
import LanguagePair from "src/components/language/pair.vue";

import type {ImageAlbum} from "src/types";

const props = defineProps({
  projectId: {
    type: [String, Number],
    required: true,
  }
});

const pageNumber = ref(1);
const {edit: onEdit} = useImageAlbum(props.projectId);

// 构造当前列表数据对象
const {state, execute: onLoad} = model.list<ImageAlbum>(function () {
    return api.version.list<ImageAlbum>(pageNumber.value, props.projectId);
  },
  // 默认值，为空时自动创建
  new model.PageResult<ImageAlbum>([]),
  // 是否默认执行，默认为 false
  true
);

//进度计算
const changeProcess = function (doneCount: number, allCount: number) {
  return (doneCount / allCount) * 100;
}

const onChangePage = function () {
  onLoad(300)
}
const onUpdateVersion = async function (data: ImageAlbum) {
  const status = await onEdit(data);
  if (status) {
    onChangePage();
  }
}

const onRemoveVersion = async function (data: ImageAlbum) {
  let status = await onSure("是否确认删除?");
  if (status) {
    status = await api.version.removeVersion(data.id);
  }
  if (status) {
    onChangePage();
  }
}
</script>

<template>
  <div>
    <Table :data-source="state.results" :pagination="false" :columns="albumColumns" :bordered="true">

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
          <Space>
            <Button class="p-0" type="link" title="编辑画册" @click="onUpdateVersion(record)">
              <Icon class="text-xl" type="edit-square"></Icon>
            </Button>
            <Button class="p-0" type="link" title="删除画册" :danger="true" @click="onRemoveVersion(record)">
              <Icon class="text-xl" type="delete-fill"></Icon>
            </Button>
          </Space>
        </template>
      </template>
    </Table>
    <Page v-model:page="pageNumber" :size="3" :total="state.total" @click="onChangePage"></Page>
  </div>
</template>