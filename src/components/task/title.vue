<script setup lang="ts">

import api from "src/api";
import {Space} from "ant-design-vue";
import * as model from "src/utils/model";

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

// 语言列表
const {state: Language} = model.list<LanguageData>(() => {
    return api.system.getDictData<LanguageData>('comic_language_type');
  },
  new model.PageResult<LanguageData>([]),
  true
);

//语言映射
const findLanguageValue = function (dict: string) {
  let value = "-";
  const res = Language.value;
  for (const element of res.results) {
    if (dict === element.code) {
      value = element.dictLabel;
      break;
    }
  }
  return value;
}


</script>

<template>
  <div class="flex items-center justify-between">
    <Space class="text-base" v-if="isReady">
      <label class="text-black">{{ state.taskName }}</label>
      <span v-if="state.estimatedStartDate && state.estimatedEndDate">
        [<label class="text-red-600">{{ state.estimatedStartDate }} ~ {{ state.estimatedEndDate }}</label>]
      </span>
      <span>
        [<label class="text-blue-600">
          {{ findLanguageValue(state.sourceLanguage) }}->{{ findLanguageValue(state.targetLanguage) }}
        </label>]
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
