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
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
});

const onOpenImage = async function () {
  let src: string | undefined;
  const type = safeGet<string>(ImageNodeType, props.type) || props.type;
  if (type) {
    const value = await api.task.getImageValue(props.id, type);
    src = preview(value);
  }
  if (src) {
    window.open(src);
  }
}

</script>

<template>
  <div>
    <Button v-if="value && props.type" type="link" @click="onOpenImage">
      <slot>预览</slot>
    </Button>
    <Button v-else type="link" :disabled="true">
      <slot>待生成</slot>
    </Button>
  </div>
</template>
