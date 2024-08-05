<!-- 错误类型配置 -->
<script setup lang="ts">
/**
 * @file 错误类型配置
 */
 import api from "src/api";
 import { ref, reactive, nextTick } from 'vue';
 import {RouterLink, useRoute} from "vue-router";
 import {Table, Button, Card, Space,Breadcrumb,BreadcrumbItem,Row,Col, Tag ,Divider,Input,Tooltip } from "ant-design-vue";
 import * as alias from "src/router/alias";


const route = useRoute();
console.log('Project ID = "%s"', route.params.projectId);
const projectId = route.params.projectId
const inputRef = ref();

const state = reactive({
  tags: ['漏译', '错译', '直译过度', '意译不足', '符号缺失', '语法错误', '拼写错误', '其它'],
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

// ---------------
const dtpState = reactive({
  tags: ['字体不匹配', '字体风格不一致', '字体大小不当','文字排版混乱','特效字处理不当','标点符号错误','断句错误','色彩问题','其它'],
  inputVisible: false,
  inputValue: '',
});

const dtphandleClose = (removedTag: string) => {
  const tags = dtpState.tags.filter(tag => tag !== removedTag);
  console.log(tags);
  dtpState.tags = tags;
};

const dtpshowInput = () => {
  dtpState.inputVisible = true;
 
};

const dtphandleInputConfirm = () => {
  const inputValue = dtpState.inputValue;
  let tags = dtpState.tags;
  if (inputValue && tags.indexOf(inputValue) === -1) {
    tags = [...tags, inputValue];
  }
  console.log(tags);
  Object.assign(dtpState, {
    tags,
    inputVisible: false,
    inputValue: '',
  });
};
// ----------------

const ostate = reactive({
  tags: ['其它'],
  inputVisible: false,
  inputValue: '',
});

const ohandleClose = (removedTag: string) => {
  const tags = ostate.tags.filter(tag => tag !== removedTag);
  console.log(tags);
  ostate.tags = tags;
};

const oshowInput = () => {
  ostate.inputVisible = true;
  
};

const ohandleInputConfirm = () => {
  const inputValue = ostate.inputValue;
  let tags = ostate.tags;
  if (inputValue && tags.indexOf(inputValue) === -1) {
    tags = [...tags, inputValue];
  }
  console.log(tags);
  Object.assign(ostate, {
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
    <Divider/>
    <Tag color="green">翻译类</Tag><br/><br/>
        <Space :size="[0, 'small']" wrap>
            <template v-for="(tag, index) in state.tags" :key="tag">
                <Tooltip v-if="tag.length > 20" :title="tag">
                <Tag :closable="index !== 0" @close="handleClose(tag)">
                    {{ `${tag.slice(0, 20)}...` }}
                </Tag>
                </Tooltip>
                <Tag v-else :closable="index !== 0" @close="handleClose(tag)">
                {{ tag }}
                </Tag>
            </template>
            <Input
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
                + 新增类别
            </Tag>
        </Space>
    <br/>
    <Divider/>
    <Tag color="blue">排版类</Tag><br/><br/>
        <Space :size="[0, 'small']" wrap>
            <template v-for="(tag, index) in dtpState.tags" :key="tag">
                <Tooltip v-if="tag.length > 20" :title="tag">
                <Tag :closable="index !== 0" @close="dtphandleClose(tag)">
                    {{ `${tag.slice(0, 20)}...` }}
                </Tag>
                </Tooltip>
                <Tag v-else :closable="index !== 0" @close="dtphandleClose(tag)">
                {{ tag }}
                </Tag>
            </template>
            <Input
                v-if="dtpState.inputVisible"
                ref="inputRef"
                v-model:value="dtpState.inputValue"
                type="text"
                size="small"
                :style="{ width: '78px' }"
                @blur="dtphandleInputConfirm"
                @keyup.enter="dtphandleInputConfirm"
            />
            <Tag v-else style="background: #fff; border-style: dashed" @click="dtpshowInput">
                <plus-outlined />
                + 新增类别
            </Tag>
        </Space>
    <br/>
    <Divider/>
    <Divider/>
    
    <Tag color="gray">其他</Tag><br/><br/>
        <Space :size="[0, 'small']" wrap>
            <template v-for="(tag, index) in ostate.tags" :key="tag">
                <Tooltip v-if="tag.length > 20" :title="tag">
                <Tag :closable="index !== 0" @close="ohandleClose(tag)">
                    {{ `${tag.slice(0, 20)}...` }}
                </Tag>
                </Tooltip>
                <Tag v-else :closable="index !== 0" @close="ohandleClose(tag)">
                {{ tag }}
                </Tag>
            </template>
            <Input
                v-if="ostate.inputVisible"
                ref="inputRef"
                v-model:value="ostate.inputValue"
                type="text"
                size="small"
                :style="{ width: '78px' }"
                @blur="ohandleInputConfirm"
                @keyup.enter="ohandleInputConfirm"
            />
            <Tag v-else style="background: #fff; border-style: dashed" @click="oshowInput">
                <plus-outlined />
                + 新增类别
            </Tag>
        </Space>
    <br/>
    <Divider/>
    
  </div>
</template>