<script setup lang="ts">
import {Icon} from "@ue/icon";
import Item from "./item.vue";
import {useRoute} from "vue-router";
import {watch, onMounted} from "vue";
import {uploadStore} from "src/store";
import {Button, Card} from "ant-design-vue";

const route = useRoute();
const store = uploadStore();

const onClose = function () {
  // 清理已完成的数据并关闭进度条
  store.clear();
  store.hidden();
}

onMounted(function () {
  // 切换页面时清空当前已上传完成的图片
  watch(() => route.name, function () {
    store.clear();
  })
});

</script>

<template>
  <div class="fixed right-0 bottom-0 z-[99999] overflow-y-auto max-h-100">
    <Card class="upload-log" size="small" v-if="store.status === 2">
      <div class="w-110">
        <Item v-for="(data, key) in store.map" :data="data" :key="key"></Item>
      </div>
    </Card>
    <div class="absolute top-2 right-2">
      <Button type="link" size="small" class="p-0 flex items-center justify-center" title="关闭"
              @click="onClose">
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
