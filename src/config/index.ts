/**
 * @file 配置信息
 * @author svon.me@gmail.com
 */


const getDomain = function () {
  let domain;
  const hostName = window.location.hostname;
  if (hostName.includes("localhost")) {
    domain = hostName;
  } else if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostName)) {
    domain = hostName;
  } else {
    const list = hostName.split(".");
    domain = list.slice(-2).join(".");
  }
  return domain;
}

const env = import.meta.env || {};

export const VITE_DOMAIN: string = getDomain();

export const VITE_LQA: string = `//${env.VITE_LQA}.${VITE_DOMAIN}`;
export const VITE_LQC: string = `//${env.VITE_LQC}.${VITE_DOMAIN}`;

// 项目名称
export const AppName = env.VITE_APP_NAME;

export const TOKEN_KEY: string = "TOKEN";
export const TOKEN_NAME: string = "Authorization";

export const TOKEN_STANDBY: string = "TokenStandby";

// 接口基础路径
export const API_BASE = import.meta.env.VITE_API_BASE;

export const PREVIEW_DOMAIN: string = "https://lqa-api.svon.org";

export const PREVIEW_IMAGE: string = "https://preview.svon.org/image";