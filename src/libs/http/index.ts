/**
 * @file http
 * @author svon.me@gmail.com
 */

import {API} from "@js-lion/api";
import {VITE_LQA} from "src/config";
import {APIConfig} from "./config/response";
import safeGet from "@fengqiaogang/safe-get";
import {requestCallback, responseCallback} from "./config/index";

import type {AxiosRequestConfig, AxiosResponse} from "axios";

const API_Server = {};

class HttpConfig {
  public server?: object;
  // erp cookie name
  public cookieName?: string;
  // 统一的 token 名称
  public authorizationName?: string;

  constructor(
    server: object = API_Server,
    // erp cookie name
    cookieName: string = "73657373696f6e",
    // 统一的 token 名称
    authorizationName: string = "token",
  ) {
    this.server = server;
    this.cookieName = cookieName;
    this.authorizationName = authorizationName;
  }
}

const onRedirect = function (code?: string | number) {
  if (code && String(code) === "401") {
    window.location.href = `${VITE_LQA}/login?referer=${window.location.href}`;
    return false;
  }
  return true;
}

/**
 *
 * @param axiosConfig Axios 配置信息
 * @param httpConfig  Http  配置信息
 * @returns
 */
const http = function (axiosConfig?: AxiosRequestConfig, httpConfig: HttpConfig = new HttpConfig(), ApiConfig?: APIConfig) {
  API.addRequest(function (req: AxiosRequestConfig) {
    if (httpConfig.cookieName) {
      try {
        return requestCallback(req, httpConfig.cookieName, httpConfig.authorizationName);
      } catch (e) {
        const code = safeGet<string>(e, "message");
        onRedirect(code);
      }
    }
    return req;
  });

  API.addResponse(function (res: AxiosResponse) {
    const code = safeGet<string>(res, "data.scode") || safeGet<string>(res, "data.code") || safeGet<string>(res, "status");
    const status = onRedirect(code);
    if (status) {
      return responseCallback(ApiConfig ? ApiConfig : new APIConfig(), res);
    }
    return void 0;
  }, function (error: any) {
    const code = safeGet<string>(error, "status");
    const status = onRedirect(code);
    if (status && error && error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  });

  // 设置全局变量
  API.setEnv(API_Server);
  API.setConfig(axiosConfig);
  if (httpConfig.server && typeof httpConfig.server === "object") {
    API.setEnv(httpConfig.server);
  }
  return API;
};

export {API, http, API_Server, HttpConfig};