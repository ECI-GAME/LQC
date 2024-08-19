<script setup lang="ts">
/**
 * @file 分页
 * @author svon.me@gmail.com
 **/

import {Pagination} from "ant-design-vue";

const $emit = defineEmits(["click", "update:page", "update:size"]);
const props = defineProps({
  total: {
    type: Number,
    required: true,
  },
  page: {
    type: Number,
    required: false,
    default: () => 1
  },
  size: {
    type: Number,
    required: false,
    default: () => 10
  }
});

const onClick = function (page: number, size: number) {
  if (props.page !== page) {
    $emit("update:page", page);
  }

  if (props.size !== size) {
    $emit("update:size", size);
  }

  const value = {pageNum: page, pageSize: size};
  setTimeout(() => {
    $emit("click", value);
  })
}

</script>

<template>
  <div class="py-5 flex justify-end">
    <Pagination @change="onClick"
                :current="page"
                :pageSize="size"
                :defaultPageSize="3"
                :total="total"
                :show-less-items="true"
                :show-total="() => `共 ${total} 条`"/>
  </div>
</template>
