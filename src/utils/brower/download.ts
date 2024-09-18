import URL from "url";
import {normalize} from "./resource";

// 使用 a 标签模拟点击下载附件
export const linkDownload = function (url: string, name?: string | null) {
  const a = document.createElement("a");
  // initEvent 已不推荐使用
  // 后期如遇到问题请参考 https://developer.mozilla.org/zh-CN/docs/Web/API/Event/Event
  const event = document.createEvent("MouseEvents");
  event.initEvent("click", false, false);
  a.href = url;
  if (name) {
    a.target = "_blank";
    a.download = name;
  }
  a.dispatchEvent(event);
  return true;
}

// 使用 iframe 标签模拟点击下载附件
export const iframeDownload = function (url: string) {
  const body = document.querySelector("body");
  if (body && url) {
    // 使用 iframe 方式下载文件
    const res = document.createElement("iframe");
    res.src = url;
    res.style.display = "none";
    body.appendChild(res);
    return true;
  }
  return false;
}

// 触发浏览器下载
export const downloadFile = function (link?: string, name?: string) {
  let value = link ? normalize(link) : link;
  if (value) {
    const status = iframeDownload(value);
    if (status) {
      return;
    }
  }
  if (value && name) {
    return linkDownload(value, name);
  } else if (value) {
    const data = URL.parse(value);
    if (data.search) {
      const params = new URLSearchParams(data.search);
      return linkDownload(value, params.get('filename'));
    }
    return linkDownload(value);
  }
}