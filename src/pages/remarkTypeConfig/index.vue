<!-- 错误类型配置 -->
<script setup lang="ts">
/**
 * @file 错误类型配置
 */
 import api from "src/api";
 import { ref, reactive, nextTick } from 'vue';
 import {RouterLink, useRoute} from "vue-router";
 import {Table, Button, Card, Space,Breadcrumb,BreadcrumbItem,Row,Col, Tag  } from "ant-design-vue";
 import * as alias from "src/router/alias";

const route = useRoute();
console.log('Project ID = "%s"', route.params.projectId);
const projectId = route.params.projectId
const inputRef = ref();
const state = reactive({
  tags: ['漏译', '错译', '术语错误'],
  inputVisible: false,
  inputValue: '',
});

const handleClose = (removedTag: string) => {
  const tags = state.tags.filter(tag => tag !== removedTag);
  console.log(tags);
  state.tags = tags;
};

const showInput = () => {
  state.inputVisible = true;
  nextTick(() => {
    inputRef.value.focus();
  });
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
  
    <Tag color="green">翻译类</Tag><br/>
        <a-space :size="[0, 'small']" wrap>
            <template v-for="(tag, index) in state.tags" :key="tag">
                <a-tooltip v-if="tag.length > 20" :title="tag">
                <Tag :closable="index !== 0" @close="handleClose(tag)">
                    {{ `${tag.slice(0, 20)}...` }}
                </Tag>
                </a-tooltip>
                <Tag v-else :closable="index !== 0" @close="handleClose(tag)">
                {{ tag }}
                </Tag>
            </template>
            <a-input
                v-if="state.inputVisible"
                ref="inputRef"
                v-model:value="state.inputValue"
                type="text"
                size="small"
                :style="{ width: '78px' }"
                @blur="handleInputConfirm"
                @keyup.enter="handleInputConfirm"
            />
            <Tag v-else style="background: #fff; border-style: dashed" @click="showInput">
                <plus-outlined />
                New Tag
            </Tag>
        </a-space>
    <br/>
    <Tag color="blue">排版类</Tag><br/>


    <Tag color="gray">其他</Tag><br/>
    
    
  </div>
</template>