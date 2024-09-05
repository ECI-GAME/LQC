/**
 * @file 用户数据
 * @author svon.me@gmail.com
 */

import api from "src/api";
import * as _ from "lodash-es";
import {defineStore} from "pinia";
import {LQC_NAME, LQA_NAME, SYSTEM_NAME} from "src/config/app";

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
  getters: {
    systemList: function (): Array<{ key: string; value: string }> {
      const list = this.info.apps;
      if (list && Array.isArray(list)) {
        const res: Array<{ key: string; value: string }> = [];
        for (const value of list) {
          switch (_.toLower(value)) {
            case _.toLower(LQA_NAME):
              res.push({key: LQA_NAME, value: SYSTEM_NAME[LQA_NAME]});
              break;
            case _.toLower(LQC_NAME):
              res.push({key: LQC_NAME, value: SYSTEM_NAME[LQC_NAME]});
              break;
          }
        }
        return res;
      }
      return [];
    }
  },
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
    },
    isOnlyLQA(): boolean {
      const apps = this.systemList;
      if (apps.length === 1) {
        if (apps[0].key === LQA_NAME) {
          return true;
        }
      }
      return false;
    },
    isOnlyLQC(): boolean {
      const apps = this.systemList;
      if (apps.length === 1) {
        if (apps[0].key === LQC_NAME) {
          return true;
        }
      }
      return false;
    }
  }
});