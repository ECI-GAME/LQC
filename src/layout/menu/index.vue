<script setup lang="tsx">
import { Icon } from "@ue/icon";
import {computed} from "vue";
import {items} from "./config";
import {Menu} from "ant-design-vue";
import {useRouter, useRoute} from "vue-router";

const route = useRoute();
const router = useRouter();
const selectedKeys = computed(function () {
  console.log(route);
  return [];
});

const onChangeMenu = function ({key}: { key: string }) {
  try {
    const page = router.resolve({name: key});
    router.push(page);
  } catch (e) {
    // todo
  }
}

</script>

<template>
  <div class="relative">
    <Menu class="h-full px-5 deep-[.ant-menu-item]:flex deep-[.ant-menu-item]:items-center"
          :items="items"
          v-model:selectedKeys="selectedKeys"
          @select="onChangeMenu"></Menu>
    <div class="absolute top-1/2 right-0 -translate-y-1/2">
      <div class="translate-x-2.5">
        <Icon class="text-4xl text-[#f0f0f0] hover:text-primary cursor-pointer" type="caret-left"></Icon>
      </div>
    </div>
  </div>
</template>
