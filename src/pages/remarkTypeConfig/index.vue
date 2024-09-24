<script setup lang="ts">
/**
 * @file 错误类型配置
 */
import api from "src/api";
import {ref, reactive} from 'vue';
import {useRoute} from "vue-router";
import onSure from "src/utils/tips/sure";
import {Card, Tag, Input, message} from "ant-design-vue";

const route = useRoute();

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
  let status = await onSure("是否确认删除？");
  if (status) {
    status = await api.project.delProjectPSErrorData(removedTag.id)
  }
  if (status) {
    fetchErrorInfo()
  }
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
    <Card class="mt-5 first:mt-0" v-for="item in state" :key="item.id" :title="item.errorTypeName">
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
    </Card>
  </div>
</template>