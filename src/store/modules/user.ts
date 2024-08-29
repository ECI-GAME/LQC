/**
 * @file 用户数据
 * @author svon.me@gmail.com
 */

import api from "src/api";
import {defineStore} from "pinia";

import {UserInfo} from "types/user";

interface State {
  info: UserInfo
}

export const userStore = defineStore("user", {
  state(): State {
    return {
      info: new UserInfo()
    };
  },
  getters: {},
  actions: {
    // 获取用户信息
    async loadUserInfo() {
      const res = await api.user.info();
      if (res) {
        this.$patch({
          info: res
        });
      } else {
        this.$patch({
          info: new UserInfo()
        });
      }
    }
  }
});