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
  remarks?: string;
  createTime: string;
  createBy: string;
  createUserName: string;
  updateBy: string;
  updateTime: string;
  projectPairs: any;
  versionName: string;
  timeCount: string;
  readOrder: string;
}


export interface VersionData {
  projectNum: string;
  verisonName: string;
  versionId: number;
  versionStatus: number;
}

export interface ProjectImage extends VersionData {
  fileId: number;
  filePath: string;
  fileName: string;

  id: string | number;
  taskId: string | number;
  imageName: string;
  originalImagePath: string;

  [key: string]: string | number;
}


export interface TextResource {
  id: number;
  typeName: string;
  typeCode: string | number;
  originalText: string;
  translationText: string;
  remark: string;
  versionId?: string | number;
  versionName?: string;
  projectId: number | string;
  projectName: string;
}