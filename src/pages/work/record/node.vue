<script setup lang="ts">
/**
 * @file 标记节点
 * @author svon.me@gmail.com
 */

import {ref} from "vue";
import api from "src/api";
import * as _ from "lodash-es";
import Word from "./word.vue";
import {Icon} from "@ue/icon";
import Comment from "./comment.vue";
import sure from "src/utils/tips/sure";
import {ElButton as Button} from "element-plus";
import {RecordTabType, useCreateBy} from "../config";
import {Space, Collapse, CollapsePanel} from "ant-design-vue";

import type {PropType} from "vue";
import {DotData, DotMatchType} from "src/components/preview/config";

const $emit = defineEmits(["update", "view", "edit", "update:activeKey"]);
const props = defineProps({
  active: {
    type: [String, Number],
    required: true
  },
  activeKey: {
    type: [String, Number],
    required: false
  },
  data: {
    type: Object as PropType<DotData>,
    required: true
  },
  index: {
    type: Number,
    required: true
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
  disabled: {
    type: Boolean,
    required: false,
  }
});

const {isCreateBy} = useCreateBy();

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

// 更新
const onUpdate = function () {
  $emit("update");
}

// 查看图片描点位置
const onShowDetail = function (data: DotData) {
  $emit("view", data);
}

// 编辑
const onEditDetail = function (data: DotData) {
  $emit("edit", data);
}

// 删除节点
const onRemoveDetail = async function (data: DotData) {
  let status = await sure("是否确认删除?");
  if (status) {
    status = await api.work.word.remove(data.id);
  }
  if (status) {
    onUpdate();
  }
}

</script>

<template>
  <Collapse class="deep-[.ant-collapse-header]:items-center">
    <CollapsePanel :key="data.id">
      <template #header>
        <div class="flex items-center justify-between">
          <span>({{ index + 1 }})</span>
          <template v-if="active === RecordTabType.Word">
            <!--标记-->
            <span class="flex-1 w-1 truncate mr-2 ml-1" :class="getTitleColor(data)">{{ data.translatedText }}</span>
            <Space>
              <Button class="p-0 text-lg" type="primary" link :disabled="disabled" @click.stop="onShowDetail(data)" title="查看详情">
                <Icon type="detail"></Icon>
              </Button>
              <Button class="p-0 text-lg" type="warning" link :disabled="disabled" @click.stop="onEditDetail(data)" title="编辑">
                <Icon type="edit-square"></Icon>
              </Button>
              <template v-if="imageStatus && _.includes(['2', '3', '15', '16'], String(imageStatus))">
                <Button class="p-0 text-lg" type="danger" link :disabled="disabled" @click.stop="onRemoveDetail(data)" title="删除">
                  <Icon type="delete-fill"></Icon>
                </Button>
              </template>
            </Space>
          </template>
          <template v-else>
            <!--批注-->
            <span class="flex-1 w-1 truncate mr-2 ml-1" :title="data.remark">{{ data.remark }}</span>
            <Space>
              <Button class="p-0 text-lg" type="primary" link :disabled="disabled" @click.stop="onShowDetail(data)" title="查看详情">
                <Icon type="detail"></Icon>
              </Button>
              <template v-if="isCreateBy(data)">
                <Button class="p-0 text-lg" type="warning" link :disabled="disabled" @click.stop="onEditDetail(data)" title="编辑">
                  <Icon type="edit-square"></Icon>
                </Button>
                <Button class="p-0 text-lg" type="danger" link :disabled="disabled" @click.stop="onRemoveDetail(data)" title="删除">
                  <Icon type="delete-fill"></Icon>
                </Button>
              </template>
            </Space>
          </template>
        </div>
      </template>
      <Comment v-if="String(data.coordinateType) === '3'" :data="data" :project-id="projectId" @success="onUpdate"/>
      <Word v-else :project-id="projectId" :data="data"></Word>
    </CollapsePanel>
  </Collapse>
</template>
