<script setup lang="ts">
import {computed} from "vue";
import {Segmented} from "ant-design-vue";

const $emit = defineEmits(["update:value", "change"]);
const props = defineProps({
  value: {
    type: [String, Number],
    required: true
  },
  list: {
    type: Array,
    required: true
  },
  disabled: {
    type: Boolean,
    default: () => false
  }
});

const active = computed({
  get: () => props.value,
  set: (value: string | number) => {
    $emit("update:value", value);
    setTimeout(() => {
      $emit("change", value);
    })
  }
});

</script>

<template>
  <Segmented v-model:value="active" :options="list" :disabled="disabled" :block="true" size="large"></Segmented>
</template>
