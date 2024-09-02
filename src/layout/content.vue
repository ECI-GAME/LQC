<script setup lang="ts">
import {Icon} from "@ue/icon";
import User from "./user/index.vue";
import {RouterView, useRoute} from "vue-router";
// import Search from "./search/index.vue";

import Breadcrumb from "src/components/breadcrumb/index.vue";

import type {PropType} from "vue";

const props = defineProps({
  status: {
    type: Boolean,
    required: false
  },
  change: {
    type: Function as PropType<(off: boolean) => void>,
    required: false
  }
});

const route = useRoute();

const onClick = function () {
  if (props.change) {
    props.change(!props.status);
  }
}

</script>

<template>
  <div class="h-full ml-[var(--layout-menu-width)] overflow-y-auto">
    <div
        class="flex items-center justify-between sticky top-0 bg-white h-[var(--header-value)] z-[99] px-4 md:px-6 border-b border-gray border-solid">
      <div class="flex items-center flex-1 mr-5">
        <div class="text-2xl cursor-pointer" @click="onClick">
          <Icon class="flex ease-in-out" :type="status ? 'indent' : 'outdent'"></Icon>
        </div>
        <!--        <Search class="max-w-2/3 min-w-1/2 w-150"></Search>-->
        <Breadcrumb v-if="route.meta && route.meta.breadcrumb"
                    class="ml-5"
                    :view="route.meta.breadcrumb"
                    :key="route.name"></Breadcrumb>
      </div>
      <User></User>
    </div>
    <RouterView v-slot="scope">
      <component :is="scope.Component" :key="route.fullPath" class="p-4 md:p-6"></component>
    </RouterView>
  </div>
</template>
