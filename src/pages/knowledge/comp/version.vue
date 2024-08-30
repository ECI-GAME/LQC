<script setup lang="ts">
import {computed} from "vue";
import api from "src/api";
import * as model from "src/utils/model";
import {ElSelect, ElOption} from "element-plus";

import type {VersionData} from "src/types";

const $emit = defineEmits(["update:value"]);
const props = defineProps({
  value: {
    type: [String, Number],
    required: false,
  },
  projectId: {
    type: [String, Number],
    required: true,
  }
});

// 版本列表
const {state: version} = model.list<VersionData>(function () {
  if (props.projectId) {
    return api.project.getVersionDict(props.projectId);
  }
  return new model.PageResult<VersionData>();
}, new model.PageResult<VersionData>(), true);


const text = computed<string | number | undefined>({
  get: () => {
    return props.value
  },
  set: (value?: string | number) => {
    $emit("update:value", value);
  }
});

</script>

<template>
  <ElSelect v-model="text" placeholder="请选择画册" clearable>
    <ElOption
        v-for="item in version.results"
        :key="item.versionId"
        :label="item.verisonName"
        :value="item.versionId">
    </ElOption>
  </ElSelect>
</template>