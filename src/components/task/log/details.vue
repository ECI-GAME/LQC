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
</script>

<template>
  <div class="flex items-center w-full">
    <span class="ml-1 first:ml-0 text-lg">{{ data.handlerName }}</span>
    <span class="ml-1 first:ml-0 text-primary">[{{ data.nodeName }}]</span>
    <span class="ml-1 first:ml-0">[{{ data.taskName }}]</span>
    <span class="ml-auto text-black text-opacity-50">{{ moment(data.startTime).format("YYYY-MM-DD hh:mm:ss") }}</span>
  </div>
</template>
