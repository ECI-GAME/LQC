<script setup lang="ts">
import * as date from "src/utils/date";

defineProps({
  value: {
    required: true,
    type: [String, Number],
  },
  format: {
    type: String,
    required: false,
    default: () => date.format,
  }
});

const time = function (value?: string | number, format?: string) {
  if (value) {
    return date.template(value, format);
  }
  return "--";
}

</script>

<template>
  <span>{{ time(value, format) }}</span>
</template>

