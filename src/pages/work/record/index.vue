<script setup lang="ts">
/**
 * @file 操作记录
 * @author svon.me@gmail.com
 */

import api from "src/api";
import WorkNode from "./node.vue";
import {RecordTabType} from "../config";
import * as model from "src/utils/model";
import onSure from "src/utils/tips/sure";
import {ref, computed, toRaw} from "vue";
import {TaskButtonStatus} from "src/types";
import safeGet from "@fengqiaogang/safe-get";
import * as work from "src/utils/work/common";
import {ElButton as Button} from "element-plus";
import UeSort from "src/components/ue/sort/row.vue";

import type {PropType} from "vue";
import type {ImageData, TaskData} from "src/types";
import type {DotData} from "src/components/preview/config";

const $emit = defineEmits(["view", "edit", "success"]);

const props = defineProps({
  active: {
    type: [String, Number],
    required: true
  },
  list: {
    type: Array as PropType<DotData[]>,
    default: () => []
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  file: {
    type: Object as PropType<ImageData>,
    required: true,
  },
  taskData: {
    type: Object as PropType<TaskData>,
    required: true,
  }
});


const fieldNames = {id: "id"};
const _state = ref<DotData[]>([]);

// 按钮操作权限
const {state: taskButton} = model.result<TaskButtonStatus>(() => {
  return api.task.taskButtons(props.file.id, props.file.taskId);
}, new TaskButtonStatus(), true);

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
  work.onSave(props.file.id, onUpdate);
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

// 提交
// 处理被退回的任务图片
const onCommit = async function () {
  let status = await onSure("是否确认提交？");
  if (status) {
    status = await api.task.confirm(props.file.id);
  }
  if (status) {
    window.location.reload();
  }
}

// 退回
// 将当前图片退回大上一个节点
const onReturn = async function () {
  let status = await onSure("是否确认退回？");
  if (status && props.taskData && props.file) {
    const data = {
      id: props.file.id,
      imageId: props.file.imageId,
      imageName: props.file.imageName,
      imageStatus: props.file.imageStatus,
      taskId: props.file.taskId,
      projectId: props.taskData.projectId,
      projectNum: props.taskData.projectNum,
    };
    status = await api.task.goBack(data);
  }
  if (status) {
    window.location.reload();
  }
}

</script>

<template>
  <div class="pb-2 deep-[th]:whitespace-nowrap deep-[th]:w-35">
    <UeSort v-if="list.length > 0" v-model:value="nodeList" :key="active" :field-names="fieldNames" @sort="onSort"
            :disabled="disabled">
      <template #default="{ data, index }">
        <WorkNode class="mt-2 first:mt-0"
                  :data="data"
                  :index="index"
                  :active="active"
                  :project-id="taskData.projectId"
                  :image-status="file.imageStatus"
                  :disabled="disabled"
                  @update="onUpdate"
                  @edit="onEditDetail"
                  @view="onShowDetail"/>
      </template>
    </UeSort>
    <slot>
      <div v-if="list.length > 0 && active === RecordTabType.Word" class="mt-2 first:mt-0 sticky bottom-0">
        <!--提交-->
        <div v-if="taskButton.commit">
          <Button class="w-full" type="warning" @click="onCommit">提交</Button>
        </div>
        <!--保存、更新 / 退回-->
        <div v-else-if="taskButton.back && (taskButton.save || taskButton.update)" class="grid grid-cols-2 gap-x-5">
          <div>
            <Button class="w-full" type="primary" @click="onSave">
              <template v-if="!file.isFinish || Number(file.isFinish) === 0">保存</template>
              <template v-else>更新</template>
            </Button>
          </div>
          <div>
            <Button class="w-full" type="danger" @click="onReturn">退回</Button>
          </div>
        </div>
        <!--保存、更新-->
        <div v-else-if="taskButton.save || taskButton.update">
          <Button class="w-full" type="primary" @click="onSave">
            <template v-if="!file.isFinish || Number(file.isFinish) === 0">保存</template>
            <template v-else>更新</template>
          </Button>
        </div>
        <!--退回-->
        <div v-else-if="taskButton.back">
          <Button class="w-full" type="danger" @click="onReturn">退回</Button>
        </div>
      </div>
    </slot>
  </div>
</template>
