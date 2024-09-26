<script setup lang="ts">
import moment from "moment";
import type {PropType} from "vue";
import type {LogData} from "src/types";


defineProps({
  data: {
    type: Object as PropType<LogData>,
    required: true,
  }
});

const format1 = "YYYY-MM-DDTHH:mm:ss.SSSZ";
const format2 = "YYYY-MM-DD hh:mm:ss";

</script>

<template>
  <div class="flex items-center w-full">
    <div class="flex-1 whitespace-pre-wrap">
      <span class="text-lg whitespace-normal mr-1">{{ data.handlerName }}</span>
      <span class="text-primary whitespace-normal mr-1">[{{ data.nodeName }}]</span>
      <span class="whitespace-normal mr-1">[{{ data.taskName }}]</span>
      <span class="inline">[{{ data.remarks }}]</span>
    </div>
    <div class="ml-1 text-black text-opacity-40">
      <span class="whitespace-normal">{{ moment(data.startTime, format1).format(format2) }}</span>
    </div>
  </div>
</template>
