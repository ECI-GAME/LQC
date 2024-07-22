/**
 * @file 路由
 * @author svon.me@gmail.com
 */

import * as alias from "./alias";
import type {Router, RouteRecordRaw} from "vue-router";
import {createRouter as _createRouter, createWebHistory} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("src/layout/index"),
    redirect: {
      name: alias.Home.name
    },
    children: [
      {
        ...alias.Home,
        component: () => import("src/pages/dashboard/index.vue"),
      },
      {
        ...alias.NotFount,
        component: () => import("src/pages/common/404.vue"),
      },
      {
        ...alias.ProjectList,
        component: () => import("src/pages/project/list.vue"),
      },
      {
        ...alias.ProjectDetails,
        component: () => import("src/pages/project/details/index.vue"),
      },
      {
        ...alias.ProjectVersion,
        component: () => import("src/pages/project/version/index.vue"),
      }
    ],
  },
];

export function createRouter(): Router {
  return _createRouter({
    routes,
    history: createWebHistory(),
  });
}