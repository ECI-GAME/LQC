<script setup lang="ts">
/**
 * @file 操作记录
 * @author svon.me@gmail.com
 */

import {ref} from "vue";
import api from "src/api";
import WorkNode from "./node.vue";
import {useRouter} from "vue-router";
import * as model from "src/utils/model";
import onSure from "src/utils/tips/sure";
import {TaskButtonStatus} from "src/types";
import safeGet from "@fengqiaogang/safe-get";
import * as work from "src/utils/work/common";
import {ElButton as Button} from "element-plus";
import UeSort from "src/components/ue/sort/row.vue";
import {CheckboxGroup, Empty, Card} from "ant-design-vue";
import {RecordTabType, backTaskListOption} from "../config";

import type {PropType} from "vue";
import type {ImageData, TaskData} from "src/types";
import type {DotData} from "src/components/preview/config";

const router = useRouter();
const $emit = defineEmits(["view", "edit", "success", "update:buttons"]);

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
  },
  buttons: {
    type: Object as PropType<TaskButtonStatus>,
    required: false,
  }
});


const fieldNames = {id: "id"};
const uuid = ref<number>(0);
const mergeList = ref<Array<string | number>>([]);

// 按钮操作权限
const {state: taskButton} = model.result<TaskButtonStatus>(async () => {
  const buttons = await api.task.taskButtons(props.file.id, props.file.taskId);
  $emit("update:buttons", buttons);
  return buttons;
}, new TaskButtonStatus(), true);


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
const onSort = async function (res: object[]) {
  const sort = new Map<string | number, number>();
  for (const item of res) {
    const value = (safeGet<number>(item, "sort") || 0) + 1;
    const key = safeGet<string | number>(item, fieldNames.id)!;
    sort.set(key, value);
  }
  const data = Object.fromEntries(sort);
  const status = await api.work.word.sort(data);
  if (status) {
    uuid.value = Date.now();
    setTimeout(onUpdate);
  }
}

// 提交
// 处理被退回的任务图片
const onCommit = async function () {
  let status = await onSure("是否确认提交？");
  if (status) {
    status = await api.task.confirm(props.file.id);
  }
  if (status) {
    await router.replace(backTaskListOption(props.taskData));
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

const onMerge = async function () {
  let status = await onSure("是否确认合并？");
  if (status) {
    const list = [...mergeList.value];
    status = await api.task.merge(list);
  }
  if (status) {
    mergeList.value = [];
    onUpdate();
  }
}

</script>

<template>
  <div class="pb-2 deep-[th]:whitespace-nowrap deep-[th]:w-35">
    <template v-if="list.length > 0">
      <CheckboxGroup class="block" v-model:value="mergeList">
        <UeSort :value="list" :key="`${active}-${uuid}`" :field-names="fieldNames" @sort="onSort"
                :disabled="disabled">
          <template #default="{ data, index }">
            <WorkNode class="mt-2 first:mt-0"
                      :data="data"
                      :index="index"
                      :active="active"
                      :project-id="taskData.projectId"
                      :disabled="disabled"
                      :taskButton="taskButton"
                      @update="onUpdate"
                      @edit="onEditDetail"
                      @view="onShowDetail"/>
          </template>
        </UeSort>
      </CheckboxGroup>
      <slot>
        <div v-if="active === RecordTabType.Word" class="mt-2 first:mt-0 sticky bottom-0">
          <!--提交-->
          <div v-if="taskButton.commit" class="flex items-center">
            <div v-if="taskButton.merge" class="flex-1 ml-5 first:ml-0">
              <Button class="w-full" :disabled="mergeList.length <= 1" @click="onMerge">合并</Button>
            </div>
            <div class="flex-1 ml-5 first:ml-0">
              <Button class="w-full" type="warning" @click="onCommit">提交</Button>
            </div>
          </div>
          <!--保存、更新 / 退回-->
          <div v-else-if="taskButton.back && (taskButton.save || taskButton.update)" class="flex items-center">
            <div v-if="taskButton.merge" class="flex-1 ml-5 first:ml-0">
              <Button class="w-full" :disabled="mergeList.length <= 1" @click="onMerge">合并</Button>
            </div>
            <div class="flex-1 ml-5 first:ml-0">
              <Button class="w-full" type="primary" @click="onSave">
                <template v-if="!file.isFinish || Number(file.isFinish) === 0">保存</template>
                <template v-else>更新</template>
              </Button>
            </div>
            <div class="flex-1 ml-5 first:ml-0">
              <Button class="w-full" type="danger" @click="onReturn">退回</Button>
            </div>
          </div>
          <!--保存、更新-->
          <div v-else-if="taskButton.save || taskButton.update" class="flex items-center">
            <div v-if="taskButton.merge" class="flex-1 ml-5 first:ml-0">
              <Button class="w-full" :disabled="mergeList.length <= 1" @click="onMerge">合并</Button>
            </div>
            <div class="flex-1 ml-5 first:ml-0">
              <Button class="w-full" type="primary" @click="onSave">
                <template v-if="!file.isFinish || Number(file.isFinish) === 0">保存</template>
                <template v-else>更新</template>
              </Button>
            </div>
          </div>
          <!--退回-->
          <div v-else-if="taskButton.back">
            <div v-if="taskButton.merge" class="flex-1 ml-5 first:ml-0">
              <Button class="w-full" :disabled="mergeList.length <= 1" @click="onMerge">合并</Button>
            </div>
            <div class="flex-1 ml-5 first:ml-0">
              <Button class="w-full" type="danger" @click="onReturn">退回</Button>
            </div>
          </div>
        </div>
      </slot>
    </template>
    <!-- 提示数据为空 -->
    <Card v-else class="py-10" size="small">
      <Empty></Empty>
    </Card>
  </div>
</template>
