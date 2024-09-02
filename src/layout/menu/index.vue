<script setup lang="tsx">
import {computed} from "vue";
import {items} from "./config";
import * as alias from "src/router/alias";
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
const selectedKeys = computed(function () {
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
  <div class="h-full border-r border-solid border-[var(--border-color)] menu-box ease-in-out" :class="{ 'off': status }">
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
              v-model:selectedKeys="selectedKeys"
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
