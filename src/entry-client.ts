/**
 * @file 客户端
 * @author svon.me@gmail.com
 */

// 引入项目全局样式
import "ant-design-vue/dist/reset.css";
import "src/styles/main.scss";

import { AppName, API_BASE } from "./config";
import { userStore } from "src/store";
import { createApp } from "./bootstrap/main";
import {http, HttpConfig} from "@ue/http";
import Cookie from "js-cookie";


http({
  timeout: 10 * 1000,      // 超时时长
  baseURL: API_BASE,      // 默认请求地址
  withCredentials: false, // 不携带 Cookie
}, new HttpConfig({}, "token", "Authorization"));

const main = async function () {

  Cookie.set("token", "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlaWQiOiIwMDAwMHJhMnp4bTUwc3BjNnEzMXdqOW9iZ2Z5NzRuZCIsInVzZXJfbmFtZSI6InJvb3QiLCJ0eiI6Ik1hcnF1ZXNhcyBTdGFuZGFyZCBUaW1lIiwicGlkIjotMSwib2lkIjotMSwib2xkaWQiOm51bGwsImNsaWVudF9pZCI6ImxxYV9nYW1lIiwiYXR0YWNocyI6IiIsImVuYW1lIjoiTFFBIiwiaHBpZCI6bnVsbCwiYXR5cGUiOiIxIiwic2NvcGUiOlsiYWxsIl0sImRuYW1lIjoiRUNJW-i2heeuoV0iLCJleHAiOjE3MjI0ODE0MzMsInF5d3giOm51bGwsImFpZCI6IjAwMDAwMDA1eHY2ZTkwb3RkbjdobWYyYjR1c3pqcGljIiwianRpIjoiMGE5ZDg2ZGQtZWM4NC00ZDI3LTg4ZjItYTZkYzJkM2FhN2MyIiwiZGlkIjotMX0.BiQjM16oE8l5fY9Yu3Du49nQF6TVf4pI2GavXcWFBst66SLaUIcy4X0OzHrWmoAnCssl3meVgdqIpF4chaVaNYIykfFlFtYkA8IrcpbKvbQLM2pO8j8nWseaUnxmlsLO1gbU5tgnd1RGg57wl-a29OtKhOa4NYOFi9Vq9ouMVcAS24V0c67eiO4hzMK5HoOnVUdSTYNv1dg-nwx-7QaaDEQk3Vo8Fvb-Yh3z5kuamo0q6rIdvXXOI_0qc5INxDwyQWLcXJoS3m0rngbfViBD0JubJoAczwJudPqmoDgEP7avkOHgmK58C3aeNyX8j77Sn63cDc8wpTtamNtHzOStow", {
    path: "/"
  })

  const { app, router } = createApp();

  const user = userStore();

  await Promise.all([
    user.loadUserInfo(), // 获取用户信息
    router.isReady()     // 加载路由
  ]);
  
  app.mount(`#${AppName}`);
};

setTimeout(main);
