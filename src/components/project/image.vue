<script setup lang="ts">
/**
 * @file 版本图片管理
 * @author svon.me@gmail.com
 **/

import {ref} from 'vue';
import api from "src/api";
import * as _ from "lodash-es";
import * as modal from "@ue/modal";
import * as model from "src/utils/model";
import {checkFileImage} from "src/utils/accpet";
import Upload from "src/components/upload/index.vue";
import UeSort from "src/components/ue/sort/image.vue";
import Loading from "src/components/loading/index.vue";
import {initSelectedList, autoSelectedList, getAllSelectList} from "./common";
import {Image, Space, Checkbox, CheckboxGroup, Divider, Button, message} from "ant-design-vue";

import type {PropType, Component} from "vue";
import type {FileData} from "src/utils/upload/common";
import type {VersionInfo, ProjectImage} from "src/types";

const $emit = defineEmits(["submit", "cancel", "update:value"])
const props = defineProps({
  value: {
    required: false,
    default: () => [],
    type: Array as PropType<Array<string | number>>,
  },
  versionId: {
    type: [Number, String],
    required: true,
  },
  projectNum: {
    type: [String, String],
    required: false,
  },
  taskId: {
    type: [Number, String],
    required: false,
  }
});


const checkAll = ref<boolean>(false);
const indeterminate = ref<boolean>(false);
const imageIds = ref<Array<string | number>>([]);
const imageAllList = ref<Array<string | number>>([]);

const {state: info} = model.result<VersionInfo>(function () {
  if (props.projectNum) {
    const data = {projectNum: props.projectNum};
    return data as VersionInfo;
  }
  return api.version.geVersionInfoById<VersionInfo>(props.versionId)
}, {} as VersionInfo, true);

const {state: list, execute: reLoad, isLoading} = model.list<ProjectImage>(async function () {
  const res = await api.version.geVersionImageById<ProjectImage>(props.versionId);
  // 根据 taskID 和 默认的 props.value 筛选需要默认选中的数据
  const all = getAllSelectList(res.results, props.taskId);
  const value = initSelectedList(res.results, props.value, props.taskId);
  imageIds.value = value;
  imageAllList.value = all;
  if (all.length === value.length) {
    checkAll.value = true;
    indeterminate.value = false;
  } else if (all.length > 0) {
    checkAll.value = false;
    indeterminate.value = true;
  } else {
    checkAll.value = false;
    indeterminate.value = false;
  }
  return res;
}, void 0, true);


const onCheckAllChange = () => {
  let value: Array<string | number | undefined> = [];
  if (checkAll.value) {
    value = imageAllList.value;
    indeterminate.value = false;
  } else {
    indeterminate.value = value.length > 0;
    value = autoSelectedList(list.value.results, props.taskId);
  }
  imageIds.value = _.compact(value);
  $emit("update:value", value);
};

const onChangeValue = function (value: Array<string | number>) {
  if (value.length > 0 && value.length === imageAllList.value.length) {
    checkAll.value = true;
    indeterminate.value = false;
  } else if (value.length > 0) {
    checkAll.value = false;
    indeterminate.value = true;
  } else {
    checkAll.value = false;
    indeterminate.value = false;
  }
  $emit("update:value", value);
}


const isOnloading = ref<boolean>(false);

const onSuccess = async function (files: FileData[]) {
  const array = _.map(files, function (item: FileData) {
    return {
      'imageName': item.fileName,
      'imageSize': item.size,
      'originalImagePath': item.src,
      'imageType': item.type,
      'projectNum': info.value.projectNum,
      'versionId': props.versionId
    };
  })
  const status = await api.version.addVersionImage(array);
  if (status) {
    message.success("上传成功");
    await reLoad(100);
  }
}

const onCancel = () => {
  $emit("submit");
}

const onSubmit = async function () {
  if (_.size(imageIds.value) < 1) {
    message.error('请至少选择一张图片!')
    return
  }
  $emit("submit");
}

const onSave = function () {
  return {
    imageIds: [...imageIds.value]
  }
}

// 更新排序
const updateSort = function (list: object[]) {
  return api.version.versionImageSort(list);
}

const onSort = async function () {
  const status = await modal.confirm<Component, boolean>(UeSort, {
    title: "图片排序",
    width: 720,
    onOk: updateSort
  }, {
    // @ts-ignore
    value: list.value.results
  });
  if (status) {
    await reLoad(100);
  }
}

defineExpose({onSubmit: onSave, getList: () => list.value.results});

</script>
<template>
  <Loading class="py-3" :status="isLoading">
    <div class="flex items-center justify-between px-3">
      <Checkbox v-model:checked="checkAll" :indeterminate="indeterminate" @change="onCheckAllChange">全选</Checkbox>
      <div class="flex items-center">
        <Space size="large">
          <Upload :multiple="true" :accept="checkFileImage" @success="onSuccess" v-model:loading="isOnloading">
            <Button :loading="isOnloading">图片上传</Button>
          </Upload>
          <Button @click="onSort">排序</Button>
        </Space>
      </div>
    </div>
    <Divider class="my-3"/>
    <div class="max-h-100 min-h-50 overflow-auto mb-3">
      <CheckboxGroup class="block clearfix cursor-default" v-model:value="imageIds" @change="onChangeValue">
        <div class="float-left ml-3 mb-3 w-25 truncate" v-for="item in list.results" :key="item.id">
          <div class="h-40 rounded-md overflow-hidden text-center" :title="item.imageName">
            <Image class="object-cover" :src="item.originalImagePath" height="100%"/>
          </div>
          <template v-if="item.taskId">
            <Checkbox class="mt-2 select-none" :value="item.id" :disabled="true">{{ item.imageName }}</Checkbox>
          </template>
          <template v-else>
            <Checkbox class="mt-2 select-none" :value="item.id">{{ item.imageName }}</Checkbox>
          </template>
        </div>
      </CheckboxGroup>
    </div>
    <div class="px-3">
      <slot name="buttons">
        <div class="text-right">
          <Space size="large">
            <Button type="primary" @click="onSubmit" :disabled="imageIds.length < 1">保存</Button>
            <Button @click="onCancel">取消</Button>
          </Space>
        </div>
      </slot>
    </div>
  </Loading>
</template>

