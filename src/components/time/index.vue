<script setup lang="ts">
import moment from "moment";

defineProps({
  value: {
    required: true,
    type: [String, Number],
  },
  format: {
    type: String,
    required: false,
    default: () => "YYYY-MM-DD hh:mm:ss",
  }
});

const time = function (value?: string | number, format?: string) {
  if (value) {
    return moment(value).format(format);
  }
  return "--";
}

</script>

<template>
  <span>{{ time(value, format) }}</span>
</template>

