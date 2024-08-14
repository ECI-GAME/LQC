<!-- 错误类型配置 -->
<script setup lang="ts">
/**
 * @file 错误类型配置
 */
 import api from "src/api";
 import { ref, reactive, nextTick } from 'vue';
 import {RouterLink, useRoute} from "vue-router";
 import {Table, Button, Card, Space,Breadcrumb,BreadcrumbItem,Row,Col, Tag,Divider,Input  } from "ant-design-vue";
 import * as alias from "src/router/alias";

const route = useRoute();
console.log('Project ID = "%s"', route.params.projectId);

const state = ref([]);
const fetchErrorInfo = async () => {
  try {
    state.value.data = await api.project.projectErrorType(route.params.projectId)
    console.log('tep');
    
   console.log(state.value);
   
    
  } catch (error) {
    console.error("Failed to fetch language:", error);
  }
};

fetchErrorInfo()
const projectId = route.params.projectId
const inputRef = ref();
let inputValue = '';
let inputVisible = false;
// const state = reactive({
//   tags:  tepError.value.value.map(obj => obj.dictLabel),
//   inputVisible: false,
//   inputValue: '',
// });

const handleClose = (removedTag: string) => {
  const tags = state.value.filter(tag => tag !== removedTag);
  console.log(tags);
  state.tags = tags;
};

const showInput = () => {
  inputVisible = true;
  console.log(inputVisible);
  
  
  // nextTick(() => {
  //   inputRef.value.focus();
  // });
};

const handleInputConfirm = () => {
  const inputValue = state.inputValue;
  let tags = state.tags;
  if (inputValue && tags.indexOf(inputValue) === -1) {
    tags = [...tags, inputValue];
  }
  console.log(tags);
  Object.assign(state, {
    tags,
    inputVisible: false,
    inputValue: '',
  });
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
    <div v-for="item in state.data" :key="item.id">
    <Tag color="green" >{{item.errorTypeName}}</Tag><br/><br/>
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
                v-if="inputVisible"
                ref="inputRef"
                v-model:value="inputValue"
                type="text"
                size="small"
                :style="{ width: '78px' }"
                @blur="handleInputConfirm"
                @keyup.enter="handleInputConfirm"
            />
            <Tag v-else v-if="!inputVisible" style="background: #fff; border-style: dashed" @click="showInput">
                <plus-outlined />
                + 新增类别
            </Tag>
        </a-space>
   
    <Divider />
    
  </div>
    
  </div>
</template>