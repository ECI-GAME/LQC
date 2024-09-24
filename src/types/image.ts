export interface ImageData {
  id: number;
  taskId: number;
  imageId: number;
  imageName: string;
  imageStatus: string;
  isFinish: string;
  handlerId: string;
  handlerName: string;
  dealTime: string; // 你可以考虑使用 Date 类型
  createBy: string | null;
  createTime: string;
  updateBy: string | null;
  updateTime: string | null;
  imagePath: string;
}

// 画册 / 版本
export interface ImageAlbum {
  dateInterval: string;
  doneCnt: number;
  id: number;
  languagePair: string;
  projectNum: string | number;
  totalCnt: number;
  versionName: number;
  versionStatus: number | string;
  remark: string;
  startDate: string | number;
  endDate: string | number;
}