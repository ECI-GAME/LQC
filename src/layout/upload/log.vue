<script setup lang="ts">
import {Icon} from "@ue/icon";
import Item from "./item.vue";
import {uploadStore} from "src/store";
import {Button, Card} from "ant-design-vue";

const store = uploadStore();

</script>

<template>
  <div class="fixed right-0 bottom-0 z-[99999]">
    <Card class="upload-log" size="small" v-if="store.status === 2">
      <div class="overflow-hidden w-110">
        <Item v-for="(data, key) in store.map" :data="data" :key="key"></Item>
      </div>
    </Card>
    <div class="absolute top-2 right-2">
      <Button type="link" size="small" class="p-0 flex items-center justify-center" title="关闭"
              @click="store.hidden">
        <Icon class="text-lg flex" type="close"/>
      </Button>
    </div>
  </div>
</template>

<style scoped lang="less">
.upload-log {
  box-shadow: 0 0 30px 0 rgba(100, 100, 111, 0.2);
}
</style>
