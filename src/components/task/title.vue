<script setup lang="ts">
import api from "src/api";
import {Space} from "ant-design-vue";
import * as model from "src/utils/model";
import LanguageDetail from "src/components/language/detail.vue";

import type {PropType} from "vue";
import type {TaskData, LanguageData} from "src/types";

const props = defineProps({
  taskId: {
    type: [String, Number],
    required: true,
  },
  data: {
    type: Object as PropType<TaskData>,
    required: false,
  }
});
// 任务详情
const {state, isReady} = model.result<TaskData>(() => {
  if (props.data) {
    return {...props.data};
  }
  return api.task.getTaskInfoById(props.taskId);
}, void 0, true);
</script>

<template>
  <div class="flex items-center justify-between">
    <Space class="text-base" v-if="isReady">
      <label class="text-black">{{ state.taskName }}</label>
      <span v-if="state.estimatedStartDate && state.estimatedEndDate">
        [<label class="text-red-600">{{ state.estimatedStartDate }} ~ {{ state.estimatedEndDate }}</label>]
      </span>
      <span>
        [<LanguageDetail class="text-blue-600" :value="state"></LanguageDetail>]
      </span>
      <span>
        [<label class="text-green-600">{{ state.handlerName }}</label>]
      </span>
      <slot></slot>
    </Space>
    <div v-if="isReady">
      <slot name="operate" :task="state"></slot>
    </div>
  </div>
</template>
