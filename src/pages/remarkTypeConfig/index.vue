<!-- 错误类型配置 -->
<script setup lang="ts">
/**
 * @file 错误类型配置
 */
import api from "src/api";
import {ref, reactive, nextTick} from 'vue';
import {RouterLink, useRoute} from "vue-router";
import {
  Table,
  Button,
  Card,
  Space,
  Breadcrumb,
  BreadcrumbItem,
  Row,
  Col,
  Tag,
  Divider,
  Input,
  Empty,
  message
} from "ant-design-vue";
import * as alias from "src/router/alias";

const route = useRoute();
console.log('Project ID = "%s"', route.params.projectId);

const state = ref<object[]>([]);
const fetchErrorInfo = async () => {
  const res = await api.project.projectErrorType(route.params.projectId as string);
  let i = 0;
  state.value = res.results.map(e => {
    i = i + 1;
    e.inputValue = ''
    e.inputVisible = false;
    return e;
  })
};

fetchErrorInfo()
const projectId = route.params.projectId

let inputValue = '';
const data = reactive({
  inputVisible: false,
  inputValue: '',
});

const handleClose = async function (removedTag: object) {


  await api.project.delProjectPSErrorData(removedTag.id)
  message.success('操作成功')
  fetchErrorInfo()

};

const showInput = (item: object) => {
  item.inputVisible = true;
  item.inputVisible
  console.log(state);

};

const handleInputConfirm = async function (item) {
  console.log('失去焦点事件......');
  const lastSort = item.childrenList[item.childrenList.length - 1].errorTypeSort
  console.log(item);
  const fromData = {
    "errorTypeName": item.inputValue,
    "errorTypeParent": item.id,
    "errorTypeSort": lastSort + 1,
    "projectId": projectId
  }

  console.log(fromData);
  await api.project.addProjectPSErrorData(fromData)
  item.inputVisible = false
  fetchErrorInfo()
};


</script>

<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem>
        <RouterLink :to="{ name: alias.ProjectDetails.name, params:{ projectId: projectId } }">
          <a href="">项目中心</a>
        </RouterLink>
      </BreadcrumbItem>

      <BreadcrumbItem>错误类型配置</BreadcrumbItem>
    </Breadcrumb>
    <br/>
    <br/>
    <div v-for="item in state" :key="item.id">
      <Tag color="green">{{ item.errorTypeName }}</Tag>
      <br/><br/>
      <a-space :size="[0, 'small']" wrap>
        <template v-for="(tag, index) in item.childrenList" :key="tag">
          <a-tooltip v-if="tag.errorTypeName.length > 20" :title="tag">
            <Tag :closable="index !== 0" @close="handleClose(tag)">
              {{ `${tag.errorTypeName.slice(0, 20)}...` }}
            </Tag>
          </a-tooltip>
          <Tag v-else :closable="index !== 0" @close="handleClose(tag)">
            {{ tag.errorTypeName }}
          </Tag>
        </template>
        <Input
            v-if="item.inputVisible"
            v-model:value="item.inputValue"
            type="text"
            size="small"
            :style="{ width: '78px' }"

            @keyup.enter="handleInputConfirm(item)"
        />
        <Tag v-else style="background: #fff; border-style: dashed" @click="showInput(item)">
          <plus-outlined/>
          + 新增类别
        </Tag>
      </a-space>

      <Divider/>

    </div>

  </div>
</template>