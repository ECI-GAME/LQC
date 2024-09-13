<script setup lang="ts">
/**
 * @file 知识库
 */
import {ref, computed} from "vue";
import Search from "./comp/search.vue";
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

const versionId = ref<string | number>(route.query.versionId as string);
const projectId = ref<string | number>(route.params.projectId as string);
const activeKey = ref<string>(String(route.query.type || list[0].key));

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
  return {name: alias.Knowledge.name, params: {...route.params}, query: {...route.query, type}};
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
    <component :key="activeKey" :is="isComp(activeKey)"
               :project-id="projectId"
               :version-id="route.query.versionId">
      <template #search>
        <Search v-model:project-id="projectId" v-model:version-id="versionId" :is-project="!!route.params.projectId"></Search>
      </template>
    </component>
  </div>
</template>