<script setup lang="tsx">
import {Icon} from "@ue/icon";
import {computed} from "vue";
import {items} from "./config";
import * as alias from "src/router/alias";
import {useRouter, useRoute, RouterLink} from "vue-router";
import {Menu, Layout, LayoutHeader, LayoutContent} from "ant-design-vue";

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
  <div class="h-full relative border-r border-solid border-[var(--border-color)]">
    <Layout class="h-full">
      <LayoutHeader class="bg-white h-[initial] leading-[initial] p-0">
        <RouterLink :to="{ name: alias.Home.name }"
            class="h-[var(--header-value)] flex items-center justify-center border-b border-solid border-[var(--border-color)]">
          <b class="text-2xl">Project C</b>
        </RouterLink>
      </LayoutHeader>
      <LayoutContent>
        <Menu class="!border-0 h-full px-5 deep-[.ant-menu-item]:flex deep-[.ant-menu-item]:items-center"
              :items="items"
              v-model:selectedKeys="selectedKeys"
              @select="onChangeMenu"></Menu>
      </LayoutContent>
    </Layout>
    <div class="absolute top-1/2 right-0 -translate-y-1/2">
      <div class="translate-x-2.5">
        <Icon class="text-4xl text-[#f0f0f0] hover:text-primary cursor-pointer" type="caret-left"></Icon>
      </div>
    </div>
  </div>
</template>
