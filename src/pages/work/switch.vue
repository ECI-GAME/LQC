<script setup lang="ts">
import {Icon} from "@ue/icon";
import {RouterLink} from "vue-router";
import {Button, Space} from "ant-design-vue";
import {getPrevRoute, getNextRoute} from "./config";

import type {PropType} from "vue";
import type {ImageData} from "src/types/image";

defineProps({
  list: {
    type: Array as PropType<ImageData[]>,
    default: () => [],
  },
  current: {
    type: Object as PropType<ImageData>,
    required: true,
  }
});

</script>

<template>
  <Space>
    <template v-if="getPrevRoute(list, current)">
      <router-link class="flex" :to="getPrevRoute(list, current)">
        <Button size="small" title="上一张">
          <Icon class="text-xl flex" type="caret-left"></Icon>
        </Button>
      </router-link>
    </template>
    <div class="flex" v-else>
      <Button size="small" :disabled="true">
        <Icon class="text-xl flex" type="caret-left"></Icon>
      </Button>
    </div>

    <template v-if="getNextRoute(list, current)">
      <router-link class="flex" :to="getNextRoute(list, current)">
        <Button size="small" title="下一张">
          <Icon class="text-xl flex" type="caret-right"></Icon>
        </Button>
      </router-link>
    </template>
    <div class="flex" v-else>
      <Button size="small" :disabled="true">
        <Icon class="text-xl flex" type="caret-right"></Icon>
      </Button>
    </div>
  </Space>
</template>
