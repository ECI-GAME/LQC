/**
 * @file 路由别名
 * @author svon.me@gmail.com
 */

import {PageType} from "./common";
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
  path: "/project/:projectId",
  meta: {
    breadcrumb: "project/details.vue"
  },
}


export const VersionImage: RouteRecordBase = {
  name: "Image Details",
  path: "/image/:projectId"
}

export const TaskList: RouteRecordBase = {
  name: "Project Task List",
  path: "/task/:projectId/:versionId",
  meta: {
    breadcrumb: "task/list.vue"
  },
}

export const TaskDetails: RouteRecordBase = {
  name: "Project Task Details",
  path: "/task/detail/:versionId/:taskId",
  meta: {
    breadcrumb: "task/details.vue"
  },
}
export const NodeConfig: RouteRecordBase = {
  name: "Project Node Config",
  path: "/node/:projectId"
}
export const Knowledge: RouteRecordBase = {
  name: "Knowledge Config",
  path: "/knowledge/:projectId"
}

export const PsTypeConfig: RouteRecordBase = {
  name: "Ps Config",
  path: "/psTypeConfig/:projectId",
  meta: {
    breadcrumb: "project/psconfig.vue"
  },
}

export const RemarkTypeConfig: RouteRecordBase = {
  name: "Image reamrk",
  path: "/remarkTypeConfig/:projectId"
}

export const Psd: RouteRecordBase = {
  name: "Image psd",
  path: "/psd"
}

export const Work: RouteRecordBase = {
  name: "Project Work",
  path: "/work/:taskId/:workId?",
  meta: {
    type: PageType.work,
    breadcrumb: "task/details.vue"
  }
}