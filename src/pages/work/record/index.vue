<script setup lang="ts">
/**
 * @file 操作记录
 * @author svon.me@gmail.com
 */

import {ref} from "vue";
import api from "src/api";
import Word from "./word.vue";
import Comment from "./comment.vue";
import {RecordTabType} from "../config";
import {Button, Space, Collapse, CollapsePanel} from "ant-design-vue";

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
});

const activeKey = ref<string | number>();

// 查看图片描点位置
const onShowDetail = function (data: DotData) {
  $emit("view", data.id);
}

const onEditDetail = function (data: DotData) {
  $emit("edit", data.id);
}

const onSave = async function () {
  const status = await api.work.onSave(props.workId);
  if (status) {
    onUpdate();
  }
}

const onUpdate = function () {
  $emit("success");
}

const getTitleColor = function (data: DotData) {
  if (data.matchType) {
    if (data.matchType === DotMatchType.update) {
      return "text-green-700";
    }
    if (data.matchType === DotMatchType.match || data.matchType === DotMatchType.noUpdate) {
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
            <span v-if="active === RecordTabType.Word"
                  class="flex-1 w-1 truncate mr-2 ml-1"
                  :class="getTitleColor(item)">{{ item.translatedText }}</span>
            <span v-else class="flex-1 w-1 truncate mr-2 ml-1" :title="item.remark">{{ item.remark }}</span>
            <Space>
              <Button class="p-0" type="link" @click.stop="onShowDetail(item)">详情</Button>
              <Button v-if="active === RecordTabType.Word"
                      class="p-0"
                      type="link"
                      :danger="true"
                      @click.stop="onEditDetail(item)">编辑
              </Button>
            </Space>
          </div>
        </template>
        <Comment v-if="String(item.coordinateType) === '3'" :data="item" :project-id="projectId" @success="onUpdate"/>
        <Word v-else :project-id="projectId" :data="item"></Word>
      </CollapsePanel>
    </Collapse>
    <slot>
      <div v-if="list.length > 0 && active === RecordTabType.Word" class="mt-2 first:mt-0 sticky bottom-0">
        <Button class="w-full" type="primary" @click="onSave">保存</Button>
      </div>
    </slot>
  </div>
</template>
