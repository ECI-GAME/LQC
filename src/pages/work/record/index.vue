<script setup lang="ts">
/**
 * @file 操作记录
 * @author svon.me@gmail.com
 */

import api from "src/api";
import WorkNode from "./node.vue";
import {RecordTabType} from "../config";
import {ref, computed, toRaw} from "vue";
import safeGet from "@fengqiaogang/safe-get";
import * as work from "src/utils/work/common";
import {ElButton as Button} from "element-plus";
import UeSort from "src/components/ue/sort/row.vue";

import type {PropType} from "vue";
import type {DotData} from "src/components/preview/config";

const $emit = defineEmits(["view", "edit", "success"]);

const props = defineProps({
  workId: {
    type: [String, Number],
    required: true
  },
  active: {
    type: [String, Number],
    required: true
  },
  list: {
    type: Array as PropType<DotData[]>,
    default: () => []
  },
  projectId: {
    type: [String, Number],
    required: true,
  },
  // 图片流程节点状态
  imageStatus: {
    type: [String, Number],
    required: false,
  },
  // 判断当前图片是否已保存
  isFinish: {
    type: [String, Number],
    required: false,
  }
});


const fieldNames = {id: "id"};
const _state = ref<DotData[]>([]);

const nodeList = computed<DotData[]>({
  get: () => {
    if (_state.value && _state.value.length > 0) {
      return _state.value;
    }
    return props.list;
  },
  set: (value: DotData[]) => {
    _state.value = [...value];
  }
});

// 查看图片描点位置
const onShowDetail = function (data: DotData) {
  $emit("view", data.id);
}

const onEditDetail = function (data: DotData) {
  $emit("edit", data.id);
}

const onUpdate = function () {
  $emit("success");
}

const onSave = function () {
  work.onSave(props.workId, onUpdate);
}

// 排序
const onSort = function (res: object[]) {
  const sort = new Map<string | number, number>();
  for (const item of res) {
    const value = safeGet<number>(item, "sort")!;
    const key = safeGet<string | number>(item, fieldNames.id)!;
    sort.set(key, value);
  }
  const data = Object.fromEntries(sort);
  api.work.word.sort(data);
}

</script>

<template>
  <div class="pb-2 deep-[th]:whitespace-nowrap deep-[th]:w-35">
    <UeSort v-if="list.length > 0" v-model:value="nodeList" :key="active" :field-names="fieldNames" @sort="onSort">
      <template #default="{ data, index }">
        <WorkNode class="mt-2 first:mt-0"
                  :data="data"
                  :index="index"
                  :active="active"
                  :project-id="projectId"
                  :image-status="imageStatus"
                  @update="onUpdate"
                  @edit="onEditDetail"
                  @view="onShowDetail"/>
      </template>
    </UeSort>
    <slot>
      <div v-if="list.length > 0 && active === RecordTabType.Word" class="mt-2 first:mt-0 sticky bottom-0">
        <Button class="w-full" type="primary" @click="onSave">
          <template v-if="!isFinish || Number(isFinish) === 0">保存</template>
          <template v-else>更新</template>
        </Button>
      </div>
    </slot>
  </div>
</template>
