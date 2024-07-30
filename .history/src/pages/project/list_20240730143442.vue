<script setup lang="ts">
import api from "src/api";
import {Icon} from "@ue/icon";
import {RouterLink} from "vue-router";
import * as model from "src/utils/model";
import * as alias from "src/router/alias";
import {Table, Button} from "ant-design-vue";
import {onCreate} from "src/utils/project";
import { onMounted} from "vue";

const columns = [
  {title: "项目名称", dataIndex: 'projectName', key: 'projectName'},
  {title: "项目编号", dataIndex: 'projectNum', key: 'projectNum'},
  {title: "发行商", dataIndex: 'comicPublisher', key: 'comicPublisher', align: "center"},
  {title: "语言对", dataIndex: 'languageInfo', key: 'languageInfo', align: "center"},
  {title: "创建时间", dataIndex: 'createTime', key: 'createTime', align: "center"},
  {title: "当前画册", dataIndex: 'version', key: 'version', align: "center"},
  {title: "已进行时长(H)", dataIndex: 'runTime', key: 'runTime', align: "center"},
  {title: "PM", dataIndex: 'createUserName', key: 'createUserName', align: "center"},
  {title: "Actions", dataIndex: 'id', key: 'action', align: "right"},
];

// 构造当前列表数据对象
const {state, execute: onLoad, isLoading} = model.list<object>(
  // 执行逻辑
  function () {
    return  api.project.list(1);
  },
  // 默认值，为空时自动创建
  new model.PageResult<object>([]),
  // 是否默认执行，默认为 false
  true
);
// 定义一个函数来处理数据
const modifyData = async () => {
  // 等待 onLoad 完成
  await onLoad();
  console.log('二次修改');
  console.log(state);
  console.log(state._value.results);
  
  // 对 state 数据进行二次修改
  if (state._value && state._value.results > 0) {
    state._value.results = state._value.results.map(item => ({
      ...item,
      name: `${item.projectName} - Modified`
    }));
  }
  console.log(state._value.results);
};
const onCreateProject = async function () {
  // 创建项目
  const status = await onCreate();
  // 状态判断
  if (status) {
    await onLoad(100); // 100 毫秒后刷新列表
  }
}
onMounted(() => {
  modifyData();
});

</script>

<template>
  <div>
    <div class="text-right">
      <Button @click="onCreateProject">新建</Button>
    </div>
    <Table class="mt-5" :loading="isLoading" :data-source="state.results" :columns="columns" :bordered="true">
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