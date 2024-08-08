<script setup lang="tsx">
import {Icon} from "@ue/icon";
import {computed} from "vue";
import {items} from "./config";
import * as alias from "src/router/alias";
import {useRouter, useRoute, RouterLink} from "vue-router";
import {Menu, Layout, LayoutHeader, LayoutContent} from "ant-design-vue";

import type {PropType} from "vue";

const props = defineProps({
  status: {
    type: Boolean,
    required: false
  },
  change: {
    type: Function as PropType<(off: boolean) => void>,
    required: false
  }
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

const onClick = function () {
  if (props.change) {
    props.change(!props.status);
  }
}

</script>

<template>
  <div class="h-full relative border-r border-solid border-[var(--border-color)] menu-box" :class="{ 'off': status }">
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
    <div v-if="change" class="absolute top-1/2 right-0 z-[999]" @click="onClick">
      <div class="menu-switch">
        <Icon type="caret-left"></Icon>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* menu 开关样式 */
.menu-box {
  .menu-switch {
    @apply translate-x-2.5 -translate-y-1/2;
    .icon-font {
      @apply text-4xl text-[#f0f0f0] hover:text-primary cursor-pointer
    }

    @at-root .menu-box.off & {
      @apply translate-x-6;
      .icon-font {
        @apply rotate-180;
      }
    }
  }

  &.off {
    .logo-text {
      span {
        @apply first:hidden;
      }
    }

    .menu-switch {
      @apply translate-x-6;
      .icon-font {
        @apply rotate-180;
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
