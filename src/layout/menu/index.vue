<script setup lang="tsx">
import {ref} from "vue";
import {items} from "./config";
import {Menu} from "ant-design-vue";

type MenuData = typeof items[0];

const selectedKeys = ref([items[0].key]);

const onChangeMenu = function ({item}: { item: MenuData }) {
  console.log(item);
}

</script>

<template>
  <Menu class="px-5 deep-[.ant-menu-item]:flex deep-[.ant-menu-item]:items-center"
        :items="items"
        v-model:selectedKeys="selectedKeys"
        @select="onChangeMenu"></Menu>
</template>
