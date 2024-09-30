/**
 * @file 工作区
 * @author svon.me@gmail.com
 **/

import api from "src/api";
import * as message from "@ue/message";
import safeGet from "@fengqiaogang/safe-get";
import {API_BASE, TOKEN_KEY, TOKEN_NAME} from "src/config";
import Authorization from "src/libs/http/config/authorization";

// 图片保存
export const onSave = async function (workId?: string | number, callback?: () => void) {
  let status: boolean | undefined;
  if (workId) {
    status = await api.work.onSave(workId);
  }
  if (status && callback && typeof callback === "function") {
    callback();
  }
}

// 文本导出
export const onDownloadText = function (taskId: string | number) {
  const auth = Authorization(TOKEN_KEY, TOKEN_NAME);
  const headers = new Headers();
  headers.set(TOKEN_NAME, safeGet<string>(auth, TOKEN_NAME)!);
  const url = `${API_BASE}project/image/translations/export?taskId=${taskId}`;
  fetch(url, {method: 'POST', headers}).then(response => {
    if (response.ok) {
      return response.blob(); // 获取文件数据
    }
    return Promise.reject(new Error());
  }).then(blob => {
    if (blob) {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'data.xlsx';  // 指定下载文件名
      link.click();
    }
  }).catch(error => {
    const tips = safeGet<string>(error, "message") || "导出时出错，还有未翻译的文本信息需处理。"
    message.error(tips);
  });
}