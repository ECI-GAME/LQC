export interface TaskData {
  id: number;
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