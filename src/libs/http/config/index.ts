/**
 * @file API 响应结果校验
 * @author svon.me@gmail.com
 */


import { asyncCheck } from "./response";
import Authorization from "./authorization";
import type { APIConfig } from "./response";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

// 处理请求前的数据
export const requestCallback = function(req: AxiosRequestConfig, cookieName: string, authorizationName?: string): AxiosRequestConfig {
  const value = Authorization(cookieName, authorizationName);
  if (value) {
    req.headers = { ...req.headers, ...value };
  }
  return req;
}
// 处理返回数据
export const responseCallback: any = function(API: APIConfig, res: AxiosResponse) {
  const status = parseInt(res.status as any, 10);
  if (status >= 200 && status < 300) {
    return asyncCheck(API, res);
  }
  return Promise.reject(res);
}

