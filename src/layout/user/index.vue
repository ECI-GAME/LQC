<script setup lang="ts">
import {Icon} from "@ue/icon";
import * as _ from "lodash-es";
import {userStore} from "src/store";
import {ElMessageBox} from "element-plus";
import {VITE_LQA, VITE_LQC} from "src/config";
import {LQA_NAME, LQC_NAME} from "src/config/app";
import {Badge, Dropdown, Menu, MenuItem} from "ant-design-vue";

const user = userStore();

const onClick = function ({key}: { key: string }) {
  if (key === LQA_NAME || key === LQC_NAME) {
    const url = key === LQA_NAME ? VITE_LQA : VITE_LQC;
    if (_.includes(window.location.origin, url) === false) {
      window.location.href = url;
    }
    return;
  }
  if (key === "logout") {
    ElMessageBox.confirm("确认是否退出当前用户?", "提示", {
      type: 'warning',
      confirmButtonClass: 'el-button--danger',
      cancelButtonText: "取消",
      confirmButtonText: "退出",
    }).then(() => {
      window.location.href = `${LQA_NAME}/logout`
    }).catch(() => {
      //取消退出
    })
  }
}

</script>

<template>
  <div class="flex items-center">
    <div class="mr-5">
      <Badge :dot="true">
        <a class="link inline-block p-1 bg-black bg-opacity-30 hover:bg-opacity-45 rounded-full">
          <Icon class="flex text-2xl" type="bell-fill"></Icon>
        </a>
      </Badge>
    </div>
    <Dropdown placement="bottomRight" :arrow="{ pointAtCenter: true }">
      <span>{{ user.info.user_name }}</span>
      <template #overlay>
        <Menu @click="onClick">
          <template v-if="_.size(user.systemList) > 1">
            <MenuItem class="px-3" v-for="item in user.systemList" :key="item.key">{{ item.value }}</MenuItem>
          </template>
          <MenuItem class="px-3" key="logout">退出登录</MenuItem>
        </Menu>
      </template>
    </Dropdown>
  </div>

</template>
