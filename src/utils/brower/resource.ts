/**
 * @file 图片/视频地址格式化
 * @author svon.me@gmail.com
 */

import URL from "url";
import * as config from "src/config/index";

export const normalize = function (value: string): string | undefined {
  if (value) {
    // 过滤错误格式的数据
    if (/^[a-z]:\/+/i.test(value)) {
      return void 0;
    }
    const url = URL.parse(value, true);
    console.log(url)
    // 修复错误地址，比如 http://http://xxx
    if (url.hostname && /^https?$/i.test(url.hostname)) {
      return normalize(`${url.hostname}:${url.pathname}${url.search || ""}`);
    }
    // 如果地址是阿里云链接地址，修复为自定义地址
    if (url.hostname && url.hostname.includes(".aliyuncs.com")) {
      const preview = URL.parse(config.PREVIEW_DOMAIN);
      url.protocol = preview.protocol;
      url.host = preview.host;
      url.hostname = preview.hostname;
      url.pathname = `/asset${url.pathname}`;
      return URL.format(url);
    }
    return value;
  }
  return void 0;
}