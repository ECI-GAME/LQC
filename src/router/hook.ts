/**
 * @file 监听路由变化
 */

import {uploadStore} from "src/store";
import * as RouterAlias from "src/router/alias";
import type {NavigationGuardNext, RouteLocationNormalized, RouteLocationNormalizedLoaded} from "vue-router";

let upload: any;

export const beforeEach = function (to: RouteLocationNormalized, from: RouteLocationNormalizedLoaded, next: NavigationGuardNext) {
  if (!upload) {
    upload = uploadStore();
  }
  if (upload && upload.hidden) {
    upload.hidden();
  }


  const matched = to.matched;
  if (matched && matched.length > 0) {
    document.title = (to.meta?.title || to.name) as string;
    next();
  } else {
    // 如果当前路由无匹配状态，则默认跳转至 404 页面
    next({
      name: RouterAlias.NotFount.name
    });
  }
}