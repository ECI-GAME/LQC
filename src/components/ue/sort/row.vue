<script setup lang="ts">
/**
 * @file 排序
 * @author svon.me@gmail.com
 **/

import {computed} from "vue";
import * as _ from "lodash-es";
import safeGet from "@fengqiaogang/safe-get";
import {VueDraggableNext} from 'vue-draggable-next';

import type {PropType} from "vue";
import type {FieldNames} from "./config";

const $emit = defineEmits(["sort", "update:value"]);
const props = defineProps({
  value: {
    required: false,
    type: Array as PropType<object[]>,
  },
  fieldNames: {
    type: Object as PropType<FieldNames>,
    required: false,
    default() {
      return {id: "id"};
    }
  },
  disabled: {
    type: Boolean,
    required: false,
  }
});

const list = computed<object[]>({
  get: () => {
    return props.value || [];
  },
  set: (value: object[]) => {
    $emit("update:value", value);
  }
});

const keyName = computed<string>(function () {
  return safeGet<string>(props.fieldNames, "id")!;
});

const getValue = function () {
  const key = keyName.value;
  return _.map(list.value, function (item: object, index: number) {
    return {
      sort: index,
      [key]: safeGet<string | number>(item, key),
    };
  });
}

const onDragSortEnd = function (e: object) {
  if (props.disabled) {
    return false;
  }
  const sortValue = _.sortBy(getValue(), "sort");
  $emit("sort", sortValue);
}

defineExpose({onSubmit: getValue});

const noTransitionOnDrag = function () {
  return !props.disabled;
}

</script>

<template>
  <div>
    <VueDraggableNext v-if="_.size(list) > 1" class="block" :list="list" @change="onDragSortEnd"
                      :move="noTransitionOnDrag">
      <template v-for="(item, index) in list" :key="`${item[keyName]}-${index}`">
        <slot :data="item" :index="index"></slot>
      </template>
    </VueDraggableNext>
    <template v-else-if="_.size(list) > 0">
      <slot :data="list[0]" :index="0"></slot>
    </template>
  </div>
</template>

