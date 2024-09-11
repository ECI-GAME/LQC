<script setup lang="tsx">
import {computed} from "vue";
import * as _ from "lodash-es";
import {useItems} from "./config";
import * as alias from "src/router/alias";
import {PageType} from "src/router/common";
import safeGet from "@fengqiaogang/safe-get";
import {useRouter, useRoute, RouterLink} from "vue-router";
import {Menu, Layout, LayoutHeader, LayoutContent} from "ant-design-vue";

const props = defineProps({
  status: {
    type: Boolean,
    required: false
  },
});

const route = useRoute();
const router = useRouter();
const {list: items} = useItems();

const hasTask = computed(function () {
  const some = _.find(items.value, {key: PageType.task});
  return !!some;
});

const selectedKeys = computed(function () {
  const value = route.meta?.type;
  if (value) {
    if (value === PageType.task) {
      if (hasTask.value) {
        return [value];
      } else {
        return [PageType.project];
      }
    }
    if (value === PageType.work) {
      if (hasTask.value) {
        return [PageType.work];
      } else {
        return [PageType.project];
      }
    }
    return [value];
  }
  return [];
});

const onChangeMenu = function (data: object) {
  const name = safeGet<string>(data, "item.name");
  const page = router.resolve({name});
  if (page) {
    router.push(page);
  }
}

</script>

<template>
  <div class="h-full border-r border-solid border-[var(--border-color)] menu-box ease-in-out"
       :class="{ 'off': status }">
    <Layout class="h-full">
      <LayoutHeader class="bg-white h-[initial] leading-[initial] p-0">
        <RouterLink :to="{ name: alias.Home.name }"
                    class="h-[var(--header-value)] flex items-center justify-center border-b border-solid border-[var(--border-color)]">
          <b class="text-2xl logo-text">
            <span class="mr-2">Project</span>
            <span>C</span>
          </b>
        </RouterLink>
      </LayoutHeader>
      <LayoutContent :class="{'deep-[.ant-menu-item]:px-2.5': status}">
        <Menu class="!border-0 w-full h-full pt-2"
              :items="items"
              mode="inline"
              :inline-collapsed="status"
              :selectedKeys="selectedKeys"
              @select="onChangeMenu"></Menu>
      </LayoutContent>
    </Layout>
  </div>
</template>

<style scoped lang="scss">
/* menu 开关样式 */
.menu-box {
  &.off {
    .logo-text {
      span {
        @apply first:hidden;
      }
    }
  }

  .ant-menu {
    @at-root .menu-box:not(.off) & {
      @apply px-5;
    }
  }
}
</style>
