/**
 * @file 路由别名
 * @author svon.me@gmail.com
 */

import type { RouteRecordBase } from "types/common";
 
export const Home: RouteRecordBase = {
  name: "dashboard",
  path: "/dashboard"
}

export const NotFount: RouteRecordBase = {
  name: "Not Fount",
  path: "/404"
}