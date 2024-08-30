<script setup lang="ts">
import {ref} from "vue";
import api from "src/api";
import Details from "./details.vue";
import * as model from "src/utils/model";
import {List, ListItem} from "ant-design-vue";
import Pagination from "src/components/page/index.vue";

import type {LogData} from "src/types";

const props = defineProps({
  taskId: {
    type: [String, Number],
    required: true,
  }
});

const page = ref(1);
const size = ref(5);
// 任务明细列表
const {state, execute: getList} = model.list<LogData>(function () {
  return api.task.getLogList<LogData>(props.taskId, page.value, size.value);
}, new model.PageResult<LogData>(), true);

const onChange = function () {
  getList(100);
}

</script>

<template>
  <div class="px-5 pt-5">
    <div class="min-h-[266px]">
      <List :data-source="state.results" :bordered="true">
        <template #renderItem="{ item }">
          <ListItem>
            <Details :data="item"></Details>
          </ListItem>
        </template>
      </List>
    </div>
    <Pagination v-model:page="page" v-model:size="size" :total="state.total" @click="onChange"></Pagination>
  </div>
</template>
