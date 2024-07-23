/**
 * @file 路由别名
 * @author svon.me@gmail.com
 */

import type {RouteRecordBase} from "types/common";

export const Home: RouteRecordBase = {
  name: "dashboard",
  path: "/dashboard"
}

export const NotFount: RouteRecordBase = {
  name: "Not Fount",
  path: "/404"
}


export const ProjectList: RouteRecordBase = {
  name: "Project List",
  path: "/project/list"
}

export const ProjectDetails: RouteRecordBase = {
  name: "Project Details",
  path: "/project/:projectId"
}

export const TaskDetails: RouteRecordBase = {
  name: "Project Task Details",
  path: "/task/:taskId"
}