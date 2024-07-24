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
      // 项目列表
      {
        ...alias.ProjectList,
        component: () => import("src/pages/project/list.vue"),
      },
      // 项目详情
      {
        ...alias.ProjectDetails,
        component: () => import("src/pages/project/details/index.vue"),
      },
      // 任务列表
      {
        ...alias.TaskList,
        component: () => import("src/pages/task/list.vue"),
      },
      // 任务明细
      {
        ...alias.TaskDetails,
        component: () => import("src/pages/task/details.vue"),
      },
      // 工作
      {
        ...alias.Work,
        component: () => import("src/pages/work/index.vue"),
      }
    ],
  },
  {
    ...alias.NotFount,
    component: () => import("src/pages/common/404.vue"),
  },
];

export function createRouter(): Router {
  return _createRouter({
    routes,
    history: createWebHistory(),
  });
}