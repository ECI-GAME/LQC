<script setup lang="ts">
import api from "src/api";
import {ImageNodeType} from "./config";
import {Button} from "ant-design-vue";
import safeGet from "@fengqiaogang/safe-get";
import {preview} from "src/utils/brower/image";
import {downloadFile} from "src/utils/brower/download";

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
  query: {
    type: Object,
    required: false,
  },
  download: {
    type: Boolean,
    required: false,
  }
});

const onOpenImage = async function () {
  let src: string | undefined;
  const type = safeGet<string>(ImageNodeType, props.type) || props.type;
  if (type) {
    const value = await api.task.getImageValue(props.id, type, props.query || {});
    if (props.download) {
      downloadFile(value);
    } else {
      src = preview(value);
    }
  }
  if (src) {
    window.open(src);
  }
}

</script>

<template>
  <div>
    <template v-if="value && props.type">
      <slot :click="onOpenImage" text="预览" :disabled="false">
        <Button class="m-0 p-0" type="link" @click="onOpenImage">预览</Button>
      </slot>
    </template>
    <template v-else>
      <slot :click="onOpenImage" text="待生成" :disabled="true">
        <Button class="m-0 p-0" type="link" @click="onOpenImage" :disabled="true">待生成</Button>
      </slot>
    </template>
  </div>
</template>
