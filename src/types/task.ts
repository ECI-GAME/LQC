import safeGet from "@fengqiaogang/safe-get";

export const TaskStatus = {
  // 进行中，处理中
  RUN: ["2", "3", "4", "5", "6", "7"],
  // 校对中，审核中
  CHECK: ["15", "16", "17"],
}

// 任务明细操作权限
export class TaskButtonStatus {
  save: boolean = false;   // 是否可以保存
  update: boolean = false; // 是否可以更新
  back: boolean = false;   // 是否可以回退
  commit: boolean = false; // 是否可以提交
  merge: boolean = false;  // 是否可以合并
  remove: boolean = false; // 是否可以删除
  constructor(value?: object) {
    if (value) {
      this.save = !!safeGet<boolean>(value, "saveButton");
      this.update = !!safeGet<boolean>(value, "updateButton");
      this.back = !!safeGet<boolean>(value, "backButton");
      this.commit = !!safeGet<boolean>(value, "comitButton");
      this.merge = !!safeGet<boolean>(value, "mergeButton");
      this.remove = !!safeGet<boolean>(value, "deleteButton");
    }
  }

}

export interface VersionInfo {
  id: number;
  projectNum: string;
  languagePair: string;
  versionName: string;
}

export interface TaskData extends VersionInfo {
  taskId?: string | number;
  projectId: number;
  versionId: number;
  taskType: string;
  taskName: string;
  estimatedStartDate: string;
  estimatedEndDate: string;
  sourceLanguage: string;
  targetLanguage: string;
  handlerId?: string;
  handlerName: string;
  taskOrder: number;
  remarks?: string;
  taskStatus: string;
  createBy: string;
  versionName: string;
}

export interface LogData {
  handlerName: string;
  taskName: string;
  nodeName: string;
  startTime: string;
}