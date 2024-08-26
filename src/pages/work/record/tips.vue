<script setup lang="ts">
import {ref, onMounted} from "vue";
import Tips from "../register/tips.vue";
import {checkWord, changeTranslationList} from "../config";

import type {PropType} from "vue";
import type {DotData} from "src/components/preview/config";

const props = defineProps({
  data: {
    required: true,
    type: Object as PropType<DotData>,
  },
  projectId: {
    type: [String, Number],
    required: true,
  },
});

const translationWord = ref<object>();

onMounted(async function () {
  const res = await checkWord(props.projectId, props.data?.originalHtml);
  translationWord.value = changeTranslationList(res.translation, translationWord.value);
})

</script>

<template>
  <Tips v-if="translationWord" :word="translationWord"></Tips>
</template>
