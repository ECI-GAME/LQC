<script setup lang="ts">
import api from "src/api";
import * as _ from "lodash-es";
import {ref, watch} from 'vue';
import * as model from "src/utils/model";
import {Image, Space, Checkbox, CheckboxGroup, Divider, Button, message} from "ant-design-vue";
import Upload from "src/components/upload/index.vue";

import type {PropType} from "vue";
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
const imageIds = ref<Array<string | number>>(props.value || []);

const isCheckedImage = function (taskId: string | number) {
  return !!(taskId && props.taskId && String(taskId) === String(props.taskId));
}

const {state: info} = model.result<VersionInfo>(function () {
  if (props.projectNum) {
    const data = {projectNum: props.projectNum};
    return data as VersionInfo;
  }
  return api.version.geVersionInfoById<VersionInfo>(props.versionId)
}, {} as VersionInfo, true);

const {state: list, execute: reLoad} = model.list<ProjectImage>(async function () {
  const res = await api.version.geVersionImageById<ProjectImage>(props.versionId);
  const value = _.map(res.results, function (item: ProjectImage) {
    if (isCheckedImage(item.taskId)) {
      return item.id;
    }
  });
  const tmp = _.compact(value)
  imageIds.value = tmp;
  indeterminate.value = tmp.length > 0;
  return res;
}, void 0, true);

const getAllImage = function () {
  const array: Array<string | number> = [];
  for (const item of list.value.results) {
    if (item.taskId) {
      if (isCheckedImage(item.taskId)) {
        array.push(item.id);
      }
    } else {
      array.push(item.id);
    }
  }
  return array;
}


const onCheckAllChange = () => {
  let value: Array<string | number | undefined> = [];
  if (checkAll.value) {
    value = getAllImage();
    indeterminate.value = false;
  } else {
    for (const item of list.value.results) {
      if (item.taskId && isCheckedImage(item.taskId)) {
        value.push(item.id);
      }
    }
    indeterminate.value = value.length > 0;
  }
  imageIds.value = _.compact(value);
  $emit("update:value", value);
};

const onChangeValue = function (value: Array<string | number>) {
  const images = getAllImage();
  if (value.length > 0 && value.length === images.length) {
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

defineExpose({onSubmit: onSave, getList: () => list.value.results});

</script>
<template>
  <div class="py-3">
    <div class="flex items-center justify-between px-3">
      <Checkbox v-model:checked="checkAll" :indeterminate="indeterminate" @change="onCheckAllChange">全选</Checkbox>
      <Upload :multiple="true" @success="onSuccess" v-model:loading="isOnloading">
        <Button :loading="isOnloading">图片上传</Button>
      </Upload>
    </div>
    <Divider class="my-3"/>
    <CheckboxGroup class="block clearfix cursor-default" v-model:value="imageIds" @change="onChangeValue">
      <div class="float-left ml-3 mb-3 w-25 truncate" v-for="item in list.results" :key="item.id">
        <div class="h-40 rounded-md overflow-hidden">
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
  </div>
</template>

