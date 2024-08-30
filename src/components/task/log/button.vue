<script setup lang="ts">
import Log from "./index.vue";
import * as modal from "@ue/modal";
import {Button} from "ant-design-vue";

const props = defineProps({
  taskId: {
    type: [String, Number],
    required: true,
  }
});

const onClick = function () {
  modal.confirm(Log, {
    width: 600,
    title: "操作记录",
    textAlign: "right",
    buttonClassName: ["px-5", "pb-5"],
  }, {
    taskId: props.taskId
  });
}

</script>

<template>
  <Button @click.stop="onClick">操作记录</Button>
</template>
