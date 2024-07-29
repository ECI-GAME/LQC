/**
 * @file 用户数据
 * @author svon.me@gmail.com
 */

import api from "src/api";
import {defineStore} from "pinia";
import {UserIfno} from "types/user";

interface State {
  info: UserIfno
}

export const userStore = defineStore("user", {
  state(): State {
    return {
      info: new UserIfno()
    };
  },
  getters: {},
  actions: {
    // 获取用户信息
    async loadUserInfo() {
      const res = await api.user.info();
      console.log(res);
      console.log("加载用户数据");
    }
  }
});