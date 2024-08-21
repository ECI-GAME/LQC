<script setup lang="ts">
import User from "./user/index.vue";
import {RouterView, useRoute} from "vue-router";
// import Search from "./search/index.vue";
import {Divider} from "ant-design-vue";

import Breadcrumb from "src/components/breadcrumb/index.vue";

const route = useRoute();

</script>

<template>
  <div class="h-full ml-[var(--layout-menu-width)] overflow-y-auto">
    <div
        class="flex items-center justify-between sticky top-0 bg-white h-[var(--header-value)] z-[99] px-4 md:px-6 border-b border-gray border-solid">
      <div class="flex-1 mr-5">
        <!--        <Search class="max-w-2/3 min-w-1/2 w-150"></Search>-->
        <Breadcrumb v-if="route.meta && route.meta.breadcrumb" :view="route.meta.breadcrumb" :key="route.name"></Breadcrumb>
      </div>
      <User></User>
    </div>
    <RouterView v-slot="scope">
      <component :is="scope.Component" :key="route.fullPath" class="p-4 md:p-6"></component>
    </RouterView>
  </div>
</template>
