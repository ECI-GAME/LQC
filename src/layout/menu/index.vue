<script setup lang="tsx">
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
  <Menu class="px-5 deep-[.ant-menu-item]:flex deep-[.ant-menu-item]:items-center"
        :items="items"
        v-model:selectedKeys="selectedKeys"
        @select="onChangeMenu"></Menu>
</template>
