export const TaskStatus = {
  // 进行中，处理中
  RUN: ["2", "3", "4", "5", "6", "7"],
  // 校对中，审核中
  CHECK: ["15", "16", "17"],
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