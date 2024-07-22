<script setup lang="ts">
/**
 * @file Application
 * @author svon.me@gmail.com
 */

import {ref} from "vue";
import {style} from "src/config/style";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import {ConfigProvider, StyleProvider} from "ant-design-vue";

import type {Locale} from "ant-design-vue/es/locale-provider";

const locale = ref<Locale>(zhCN);

const theme = {
  token: {
    colorLink: style.primary,
    colorPrimary: style.primary,
    colorText: style.black,
  },
  components: {
    Button: {
      colorPrimary: style.primary
    }
  }
};

</script>

<template>
  <ConfigProvider :locale="locale" :theme="theme">
    <StyleProvider hash-priority="low">
      <router-view></router-view>
    </StyleProvider>
  </ConfigProvider>
</template>
