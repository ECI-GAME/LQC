<script setup lang="ts">
import * as _ from "lodash-es";
import * as modal from "@ue/modal";
import {Button} from "ant-design-vue";
import safeGet from "@fengqiaogang/safe-get";
import Image from "src/components/project/image.vue";

import type {PropType} from "vue";

const $emit = defineEmits(["submit", "cancel", "update:value", "change"])
const props = defineProps({
  value: {
    required: false,
    default: () => [],
    type: Array as PropType<Array<string | number>>,
  },
  versionId: {
    type: [Number, String],
    required: true,
  },
  projectNum: {
    type: [String, String],
    required: false,
  },
  taskId: {
    type: [Number, String],
    required: false,
  },
  count: {
    type: [Number, String],
    required: false,
  }
});

const toImageValue = function (list: object[]): Array<string | number> {
  const array = _.map(list, (item: object) => {
    if (_.isString(item) || _.isNumber(item)) {
      return item;
    }
    return safeGet<string | number>(item, "id");
  });
  return _.compact(array);
}

const onClick = async function () {
  const value = props.value ? toImageValue(props.value as any) : [];
  // console.log(value);
  const res = await modal.confirm(Image, {width: 650, title: "图片选择"}, {
    value,
    taskId: props.taskId,
    versionId: props.versionId,
    projectNum: props.projectNum,
  });
  if (res) {
    // console.log(res)
    const images = safeGet<Array<string | number>>(res, "imageIds") || [];
    const list = _.concat([], [...images]);
    const temp = _.compact(list).map((id: string | number) => {
      return {id};
    });
    // console.log(temp);
    $emit("change", temp);
    $emit("update:value", temp);
  }
}
</script>

<template>
  <Button type="primary" @click="onClick">
    <span>选择图片资源</span>
    <span class="ml-2" v-if="value.length > 0">已选择（{{ value.length }}）张图片</span>
    <span class="ml-2" v-else>已选择（{{ count || 0 }}）张图片</span>
  </Button>
</template>
