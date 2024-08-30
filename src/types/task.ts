export const TaskStatus = {
  // 进行中，处理中
  RUN: ["2", "3", "4", "5", "6", "7"],
  // 校对中，审核中
  CHECK: ["15", "16", "17"],
}


export interface TaskData {
  id: number;
  projectId: number;
  projectNum: string;
  versionId: number;
  taskType: string;
  taskName: string;
  estimatedStartDate: string;
  estimatedEndDate: string;
  sourceLanguage: string;
  targetLanguage: string;
  handlerId: string | null;
  handlerName: string;
  taskOrder: number;
  remarks: string | null;
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