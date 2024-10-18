/**
 * @file 工作区
 * @author svon.me@gmail.com
 **/

import api from "src/api";
import {API_BASE} from "src/config";
import * as alias from "src/router/alias";
import * as path from "src/utils/brower/path";
import {show as loading} from "src/utils/loading";
import {downloadFile} from "src/utils/brower/download";


import type {TaskData, Project} from "src/types";

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
  // const auth = Authorization(TOKEN_KEY, TOKEN_NAME);
  // const headers = new Headers();
  // headers.set(TOKEN_NAME, safeGet<string>(auth, TOKEN_NAME)!);
  // const url = `${API_BASE}project/image/translations/export?taskId=${taskId}`;
  // fetch(url, {method: 'POST', headers}).then(response => {
  //   if (response.ok) {
  //     return response.blob(); // 获取文件数据
  //   }
  //   return Promise.reject(new Error());
  // }).then(blob => {
  //   if (blob) {
  //     const link = document.createElement('a');
  //     link.href = window.URL.createObjectURL(blob);
  //     link.download = 'data.xlsx';  // 指定下载文件名
  //     link.click();
  //   }
  // }).catch(error => {
  //   const tips = safeGet<string>(error, "message") || "导出时出错，还有未翻译的文本信息需处理。"
  //   message.error(tips);
  // });
  loading("下载中...", 1500);
  const url = path.join(API_BASE, "/project/tasks/downloadPsfile") + `?taskId=${taskId}`;
  downloadFile(url, "truncate.txt");
}

// 提交
export const onSubmit = async function (task: TaskData, project: Project) {
  const data = {
    // 必传
    id: task.id,
    taskStatus: task.taskStatus,
    projectNum: project.projectNum,
    projectId: project.id,
    // 非必传
    taskName: task.taskName,
    taskOrder: task.taskOrder,
    sourceLanguage: task.sourceLanguage,
    targetLanguage: task.targetLanguage,
    versionId: task.versionId,
    versionName: task.versionName,
  };
  const status = await api.work.onSubmit(data);
  const page = {
    name: alias.TaskList.name,
    params: {
      versionId: task.versionId, projectId: project.id
    }
  }
  return {status, taskList: page};
}