<script setup lang="ts">
import {computed} from "vue";
import api from "src/api";
import * as model from "src/utils/model";
import {FormItem, Select, SelectOption} from "ant-design-vue";

import type {VersionData} from "src/types";

const $emit = defineEmits(["update:projectId", "update:versionId", "change"]);
const props = defineProps({
  projectId: {
    type: [String, Number],
    required: false,
  },
  versionId: {
    type: [String, Number],
    required: false,
  },
  isProject: {
    type: Boolean,
    default: () => false,
  }
});

// 项目列表
const {state: projectState} = model.list<object>(() => {
  return api.task.projectList();
}, void 0, true);

// 版本列表
const {state: versionState, execute: onLoad} = model.list<VersionData>(function () {
  if (props.projectId) {
    return api.project.getVersionDict(props.projectId);
  }
  return new model.PageResult<VersionData>();
}, new model.PageResult<VersionData>(), true);

const onChangeVersion = function () {
  $emit("update:versionId", void 0);
  onLoad(300);
}


const project = computed<string | number | undefined>({
  get: () => {
    return props.projectId
  },
  set: (value?: string | number) => {
    $emit("update:projectId", value);
    $emit("update:versionId", void 0);
    $emit("change");
  }
});

const version = computed<string | number | undefined>({
  get: () => {
    return props.versionId
  },
  set: (value?: string | number) => {
    $emit("update:versionId", value);
    $emit("change");
  }
});

</script>

<template>
  <div class="flex">
    <FormItem v-show="!isProject">
      <Select class="w-40" v-model:value="project" placeholder="请选择项目" :allow-clear="true" @change="onChangeVersion">
        <SelectOption
            v-for="item in projectState.results"
            :key="item.id"
            :value="String(item.id)">{{ item.projectName }}
        </SelectOption>
      </Select>
    </FormItem>
    <FormItem>
      <Select class="w-40" v-model:value="version" placeholder="请选择画册" :allow-clear="true">
        <SelectOption
            v-for="item in versionState.results"
            :key="item.versionId"
            :value="item.versionId">{{ item.verisonName }}
        </SelectOption>
      </Select>
    </FormItem>
  </div>
</template>