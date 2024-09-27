<script setup lang="ts">
import * as _ from "lodash-es";
import {Descriptions, DescriptionsItem} from "ant-design-vue";

defineProps({
  word: {
    type: Object,
    default: function () {
      return {};
    }
  }
})

const isNull = function (value: any): boolean {
  if (_.isNil(value) || _.isNull(value)) {
    return true;
  }
  if (_.isString(value) && value === "null") {
    return true;
  }
  return false;
}

</script>

<template>
  <Descriptions class="mb-5 deep-[th]:hidden" :column="1" :bordered="true" size="small">
    <template v-for="(name, value) in word" :key="name">
      <DescriptionsItem>
        <span class="mr-3">{{ name }}:</span>
        <span>{{ isNull(value) ? "" : value }}</span>
      </DescriptionsItem>
    </template>
  </Descriptions>
</template>

