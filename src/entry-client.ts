/**
 * @file 客户端
 * @author svon.me@gmail.com
 */

// 引入项目全局样式
import "ant-design-vue/dist/reset.css";
import "src/styles/main.scss";

import {AppName, API_BASE, TOKEN_KEY, TOKEN_NAME} from "./config";
import {userStore} from "src/store";
import {createApp} from "./bootstrap/main";
import {http, HttpConfig} from "@ue/http";

http({
  timeout: 10 * 1000,      // 超时时长
  baseURL: API_BASE,      // 默认请求地址
  withCredentials: false, // 不携带 Cookie
}, new HttpConfig({}, TOKEN_KEY, TOKEN_NAME));

const main = async function () {

  const {app, router} = createApp();

  const user = userStore();

  await Promise.all([
    user.loadUserInfo(), // 获取用户信息
    router.isReady()     // 加载路由
  ]);

  app.mount(`#${AppName}`);
};

setTimeout(main);
