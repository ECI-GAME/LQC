<script setup lang="ts">
/**
 * @file 图片排序
 * @author svon.me@gmail.com
 **/
import {ref} from "vue";
import {Image} from "ant-design-vue";
import safeGet from "@fengqiaogang/safe-get";
import {VueDraggableNext} from 'vue-draggable-next';

import type {PropType} from "vue";

const props = defineProps({
  value: {
    required: false,
    type: Array as PropType<object[]>,
  },
  fieldNames: {
    type: Object as PropType<{ label: string; value: string }>,
    required: false,
    default() {
      return {label: "imageName", value: "originalImagePath", id: "id"};
    }
  },
});

const images = ref<object[]>(props.value || []);

const getSrc = function (value: object) {
  const key = safeGet<string>(props.fieldNames, 'value');
  return safeGet<string>(value, key);
}

const getTitle = function (value: object) {
  const key = safeGet<string>(props.fieldNames, 'label');
  return safeGet<string>(value, key);
}

const onSubmit = function () {
  const key = safeGet<string>(props.fieldNames, "id");
  return [...images.value].map(function (item: object, index: number) {
    return {
      sort: index,
      id: safeGet<string | number>(item, key),
    };
  });
}

defineExpose({onSubmit});

</script>

<template>
  <div>
    <div class="overflow-y-auto h-100 deep-[.ant-image]:w-full">
      <VueDraggableNext class="block" v-model:list="images">
        <div v-for="(data, index) in images" :key="`${index}-${getSrc(data)}`"
             class="w-30 h-40 ml-5 mt-5 inline-block rounded-md overflow-hidden border border-solid border-gray relative">
          <slot name="item" :data="data">
            <Image class="object-cover w-full block" :src="getSrc(data)" height="100%"/>
          </slot>
          <div class="absolute z-1 top-0 left-0 right-0 bg-black bg-opacity-60 text-primary p-1 line-clamp-3">{{ getTitle(data) }}</div>
        </div>
      </VueDraggableNext>
    </div>
    <div class="p-5">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

