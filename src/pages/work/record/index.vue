<script setup lang="ts">
/**
 * @file 操作记录
 * @author svon.me@gmail.com
 */

import api from "src/api";
import Word from "./word.vue";
import Comment from "./comment.vue";
import {RecordType} from "./config";
import {Card, Button, Space, Empty} from "ant-design-vue";

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
});


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

</script>

<template>
  <div>
    <div v-if="list.length > 0" class="deep-[th]:whitespace-nowrap deep-[th]:w-35">
      <Card class="mt-2 first:mt-0" size="small" v-for="(item, index) in list" :key="item.imageId">
        <template #title>
          <div class="flex items-center justify-between">
            <span>序号: {{ index + 1 }}</span>
            <Space>
              <Button class="p-0" type="link" @click="onShowDetail(item)">详情</Button>
              <Button v-if="active === RecordType[0]" class="p-0" type="link" :danger="true"
                      @click="onEditDetail(item)">编辑
              </Button>
            </Space>
          </div>
        </template>
        <template v-if="active === RecordType[0]">
          <Word :data="item"></Word>
        </template>
        <template v-else-if="active === RecordType[1]">
          <Comment :data="item" :project-id="projectId" @success="onUpdate"></Comment>
        </template>
      </Card>
      <div v-if="active === RecordType[0]" class="mt-2 first:mt-0 sticky bottom-0">
        <Button class="w-full" type="primary" @click="onSave">保存</Button>
      </div>
    </div>
    <Card v-else class="py-10" size="small">
      <Empty></Empty>
    </Card>
  </div>
</template>
