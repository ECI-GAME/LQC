export interface Project {
  id: number;
  projectNum: string;
  projectName: string;
  comicPublisher: string;
  planStartTime: string;
  planEndTime: string;
  sourceLanguage: string;
  targetLanguage: string;
  projectStatus: string;
  imageType: string;
  projectExplain: string;
  remarks: string | null;
  createTime: string;
  createBy: string;
  createUserName: string;
  updateBy: string | null;
  updateTime: string | null;
  projectPairs: any | null;
  versionName: string | null;
  timeCount: string | null;
  readOrder: string;
}
