<script setup lang="ts">
/**
 * @file 图片下载
 * @author svon.me@gmail.com
 **/

import {Icon} from "@ue/icon";
import Preview from "./preview.vue";
import {Button, Space} from "ant-design-vue";
import safeGet from "@fengqiaogang/safe-get";

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
  value: {
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  icon: {
    type: Boolean,
    required: false,
  }
});
</script>

<template>
  <Preview :value="value"
           :id="id"
           :type="type"
           :query="{ download: true }"
           :download="true">
    <template #default="data">
      <Button v-if="icon" type="primary" size="small" :disabled="data.disabled" @click="data.click">
        <Space :size="4">
          <Icon class="text-xl flex" type="download"></Icon>
          <span>{{ data.disabled ? safeGet(data, "text") : "下载" }}</span>
        </Space>
      </Button>
      <Button v-else class="m-0 p-0" type="link" :disabled="data.disabled" @click="data.click">
        <span>{{ data.disabled ? safeGet(data, "text") : "下载" }}</span>
      </Button>
    </template>
  </Preview>
</template>

