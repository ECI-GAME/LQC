<script setup lang="ts">
/**
 * @file 排序
 * @author svon.me@gmail.com
 **/

import * as _ from "lodash-es";
import {computed, toRaw, ref} from "vue";
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
});

const uuid = ref<number>(Math.random());
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
  return _.map(props.value, function (item: object, index: number) {
    return {
      sort: index,
      [key]: safeGet<string | number>(item, key),
    };
  });
}

const onDragSortEnd = function (e: object) {
  const newIndex = safeGet<number>(e, "moved.newIndex")!;
  const oldIndex = safeGet<number>(e, "moved.oldIndex")!;
  const res = _.map(list.value, toRaw);
  const temp = res[oldIndex];
  res[oldIndex] = res[newIndex];
  res[newIndex] = temp;
  list.value = res;

  uuid.value = Math.random();

  $emit("sort", getValue());
}

defineExpose({onSubmit: getValue});

</script>

<template>
  <div>
    <VueDraggableNext v-if="_.size(list) > 1" class="block" :key="uuid" :list="[...list]" @change="onDragSortEnd">
      <template v-for="(item, index) in list" :key="`${item[keyName]}-${index}`">
        <slot :data="item" :index="index"></slot>
      </template>
    </VueDraggableNext>
    <template v-else-if="_.size(list) > 0">
      <slot :data="list[0]" :index="0"></slot>
    </template>
  </div>
</template>

