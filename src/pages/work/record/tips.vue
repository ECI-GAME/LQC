<script setup lang="ts">
import Tips from "../register/tips.vue";

import type {PropType} from "vue";
import type {DotData} from "src/components/preview/config";


const props = defineProps({
  data: {
    required: true,
    type: Object as PropType<DotData>,
  },
});

const translationWord = {};

// todo 加载时调用关键词检索接口，将结果展示出来

</script>

<template>
  <Tips :word="translationWord"></Tips>
</template>
