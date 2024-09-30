<script setup lang="ts">
import {Icon} from "@ue/icon";
import {Progress, Button} from "ant-design-vue";
import {Status} from "src/libs/upload/util/common/res";

import type {PropType} from "vue";
import type {UploadData} from "src/store/modules/upload";

const props = defineProps({
  data: {
    required: true,
    type: Object as PropType<UploadData>,
  }
});

const onReloadUpload = function () {
  const data = props.data;
  if (data && data.reload) {
    data.reload();
  }
}

</script>

<template>
  <div>
    <p class="truncate text-black text-opacity-60 pr-10">{{ data.name }}</p>
    <div class="flex items-center">
      <div class="flex-1">
        <template v-if="data.status === Status.abnormal">
          <Progress class="mb-1" :percent="data.progress || 0" size="small" :show-info="false"
                    status="exception"></Progress>
        </template>
        <template v-else>
          <Progress class="mb-1" :percent="data.progress || 0" size="small" :show-info="false"></Progress>
        </template>
      </div>
      <div class="ml-2 w-9 flex items-center justify-center">
        <template v-if="data.status === Status.complete">
          <Icon class="text-[#52c41a] text-base" type="check-circle-fill"></Icon>
        </template>
        <Button v-else-if="data.status === Status.abnormal"
                class="p-0 h-[initial] leading-[initial]"
                :danger="true"
                type="link"
                @click="onReloadUpload">
          <Icon class="text-base" type="sync"></Icon>
        </Button>
        <span v-else>{{ data.progress }}%</span>
      </div>
    </div>
  </div>
</template>
