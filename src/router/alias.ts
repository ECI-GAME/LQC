/**
 * @file 路由别名
 * @author svon.me@gmail.com
 */

import {PageType} from "./common";
import type {RouteRecordBase} from "types/common";

export const Home: RouteRecordBase = {
  name: "/home/table/index",
  path: "/dashboard",
  meta: {
    title: "Dashboard",
    type: PageType.dashboard,
  }
}

export const NotFount: RouteRecordBase = {
  name: "Not Fount",
  path: "/404"
}


export const ProjectList: RouteRecordBase = {
  name: "/project/info/table/index",
  path: "/project/list",
  meta: {
    type: PageType.project,
    title: "Project List"
  }
}

export const ProjectDetails: RouteRecordBase = {
  name: "Project Details",
  path: "/project/:projectId",
  meta: {
    type: PageType.project,
    breadcrumb: "project/details.vue"
  },
}


export const VersionImage: RouteRecordBase = {
  name: "Image Details",
  path: "/image/:projectId",
  meta: {
    breadcrumb: "project/image.vue"
  },
}

export const TaskList: RouteRecordBase = {
  name: "/task/list",
  path: "/task/:projectId?/:versionId?",
  meta: {
    type: PageType.task,
    title: "Task List",
    breadcrumb: "task/list.vue"
  },
}

export const TaskDetails: RouteRecordBase = {
  name: "Project Task Details",
  path: "/task/detail/:versionId/:taskId",
  meta: {
    type: PageType.task,
    title: "Task Details",
    breadcrumb: "task/details.vue"
  },
}
export const NodeConfig: RouteRecordBase = {
  name: "Project Node Config",
  path: "/node/:projectId",
  meta: {
    type: PageType.project,
    title: "Project Configuration",
    breadcrumb: "project/node.vue"
  },
}
export const Knowledge: RouteRecordBase = {
  name: "/knowledge/index",
  path: "/knowledge/:projectId?",
  meta: {
    type: PageType.knowledge,
    title: "Project Configuration",
    breadcrumb: "project/knowledge.vue"
  },
}

export const PsTypeConfig: RouteRecordBase = {
  name: "Ps Config",
  path: "/psTypeConfig/:projectId",
  meta: {
    type: PageType.project,
    title: "Project Configuration",
    breadcrumb: "project/psconfig.vue"
  },
}

export const RemarkTypeConfig: RouteRecordBase = {
  name: "Image remark",
  path: "/remarkTypeConfig/:projectId",
  meta: {
    breadcrumb: "project/config.vue"
  },
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