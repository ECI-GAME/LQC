<script setup lang="ts">
/**
 * @file 知识库
 */
import {ref} from "vue";
import * as alias from "src/router/alias";
import lazyload from "src/utils/lazyload";
import {Tabs, TabPane} from "ant-design-vue";
import {useRoute, RouterLink} from "vue-router";

const route = useRoute();

const list = [
  {key: "1", value: "文件资源"},
  {key: "2", value: "文本资源"},
  {key: "3", value: "图片资源"},
];

const activeKey = ref<string>(String(route.params.type || list[0].key));

const isComp = function (type: string) {
  if (type === list[1].key) {
    return lazyload(() => import("./text.vue"));
  }
  if (type === list[2].key) {
    return lazyload(() => import("./image.vue"));
  }
  return lazyload(() => import("./file.vue"));
}

const getRouteValue = function (type: string) {
  return {name: alias.Knowledge.name, params: {...route.params, type}, query: route.query};
}
</script>

<template>
  <div>
    <Tabs :activeKey="activeKey">
      <TabPane v-for="item in list" :key="item.key">
        <template #tab>
          <RouterLink :to="getRouteValue(item.key)">{{ item.value }}</RouterLink>
        </template>
      </TabPane>
    </Tabs>
    <component :is="isComp(activeKey)"
               :project-id="route.params.projectId"
               :version-id="route.query.versionId"></component>
  </div>
</template>