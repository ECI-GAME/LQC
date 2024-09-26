<script setup lang="ts">
/**
 * @file 操作记录
 * @author svon.me@gmail.com
 */

import {ref} from "vue";
import api from "src/api";
import * as _ from "lodash-es";
import Word from "./word.vue";
import {Icon} from "@ue/icon";
import Comment from "./comment.vue";
import sure from "src/utils/tips/sure";
import safeGet from "@fengqiaogang/safe-get";
import * as work from "src/utils/work/common";
import {ElButton as Button} from "element-plus";
import {RecordTabType, useCreateBy} from "../config";
import {Space, Collapse, CollapsePanel} from "ant-design-vue";

import type {PropType} from "vue";
import {DotData, DotMatchType} from "src/components/preview/config";

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

const {isCreateBy} = useCreateBy();
const activeKey = ref<string | number>();

// 查看图片描点位置
const onShowDetail = function (data: DotData) {
  $emit("view", data.id);
}

const onEditDetail = function (data: DotData) {
  $emit("edit", data.id);
}

const onRemoveDetail = async function (data: DotData) {
  let status = await sure("是否确认删除?");
  if (status) {
    status = await api.work.word.remove(data.id);
  }
  if (status) {
    onUpdate();
  }
}

const onSave = function () {
  work.onSave(props.workId, onUpdate);
}

const onSort = async function (data: DotData, index: number) {
  if (index < 1) {
    return false;
  }
  const prev = props.list[index - 1];
  const sort = new Map<string | number, number>();
  for (let i = 0, size = props.list.length; i < size; i++) {
    const item = props.list[i];
    sort.set(item.id, i + 1);
  }
  if (sort.get(prev.id)) {
    sort.set(prev.id, sort.get(prev.id)! + 1);
  }
  if (sort.get(data.id)) {
    sort.set(data.id, sort.get(prev.id)! - 1);
  }
  const status = await api.work.word.sort(Object.fromEntries(sort));
  if (status) {
    onUpdate();
  }
}


const onUpdate = function () {
  $emit("success");
}

const getTitleColor = function (data: DotData) {
  if (data.matchType) {
    if (String(data.matchType) === String(DotMatchType.update)) {
      return "text-green-700";
    }
    if (String(data.matchType) === String(DotMatchType.match) || String(data.matchType) === String(DotMatchType.noUpdate)) {
      return "text-[red]";
    }
  }
}

</script>

<template>
  <div class="pb-2 deep-[th]:whitespace-nowrap deep-[th]:w-35">
    <Collapse v-if="list.length > 0" class="deep-[.ant-collapse-header]:items-center" v-model:activeKey="activeKey">
      <CollapsePanel v-for="(item, index) in list" :key="item.id">
        <template #header>
          <div class="flex items-center justify-between">
            <span>({{ index + 1 }})</span>
            <template v-if="active === RecordTabType.Word">
              <!--标记-->
              <span class="flex-1 w-1 truncate mr-2 ml-1" :class="getTitleColor(item)">{{ item.translatedText }}</span>
              <Space>
                <Button class="p-0 text-lg" type="success" link @click.stop="onSort(item, index)" title="向上排序">
                  <Icon type="arrowup"></Icon>
                </Button>
                <Button class="p-0 text-lg" type="primary" link @click.stop="onShowDetail(item)" title="查看详情">
                  <Icon type="detail"></Icon>
                </Button>
                <Button class="p-0 text-lg" type="warning" link @click.stop="onEditDetail(item)" title="编辑">
                  <Icon type="edit-square"></Icon>
                </Button>
                <template v-if="imageStatus && _.includes(['2', '3', '15', '16'], String(imageStatus))">
                  <Button class="p-0 text-lg" type="danger" link @click.stop="onRemoveDetail(item)" title="删除">
                    <Icon type="delete-fill"></Icon>
                  </Button>
                </template>
              </Space>
            </template>
            <template v-else>
              <!--批注-->
              <span class="flex-1 w-1 truncate mr-2 ml-1" :title="item.remark">{{ item.remark }}</span>
              <Space>
                <Button class="p-0 text-lg" type="success" link @click.stop="onSort(item, index)" title="向上排序">
                  <Icon type="arrowup"></Icon>
                </Button>
                <Button class="p-0 text-lg" type="primary" link @click.stop="onShowDetail(item)" title="查看详情">
                  <Icon type="detail"></Icon>
                </Button>
                <template v-if="isCreateBy(item)">
                  <Button class="p-0 text-lg" type="warning" link @click.stop="onEditDetail(item)" title="编辑">
                    <Icon type="edit-square"></Icon>
                  </Button>
                  <Button class="p-0 text-lg" type="danger" link @click.stop="onRemoveDetail(item)" title="删除">
                    <Icon type="delete-fill"></Icon>
                  </Button>
                </template>
              </Space>
            </template>
          </div>
        </template>
        <Comment v-if="String(item.coordinateType) === '3'" :data="item" :project-id="projectId" @success="onUpdate"/>
        <Word v-else :project-id="projectId" :data="item"></Word>
      </CollapsePanel>
    </Collapse>
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
