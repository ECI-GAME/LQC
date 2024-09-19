<script setup lang="ts">
import api from "src/api";
import {ImageNodeType} from "./config";
import {Button} from "ant-design-vue";
import safeGet from "@fengqiaogang/safe-get";
import {preview} from "src/utils/brower/image";

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
  value: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
});

const onOpenImage = async function () {
  const type: string = safeGet<string>(ImageNodeType, props.type)!;
  const value = await api.task.getImageValue(props.id, type);
  const src = preview(value);
  if (src) {
    window.open(src);
  }
}

</script>

<template>
  <div>
    <Button v-if="value && safeGet(ImageNodeType, props.type)" type="link" @click="onOpenImage">预览</Button>
    <span v-else>待生成</span>
  </div>
</template>
