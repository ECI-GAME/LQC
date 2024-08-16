import {TaskStatus} from "src/types";
import {basename} from "src/utils/image";
import type {ImageData} from "src/types/image";

export const DotType = {
  "1": "框内",
  "2": "框外"
}


export enum DotButton {
  Crop = "font-size",
  Location = "location-fill"
}

export const isCheckStatus = function (data: ImageData) {
  const status: string = String(data.imageStatus);
  return TaskStatus.CHECK.includes(status);
}

export const getDotButtons = function (data: ImageData): string[] {
  const status: string = String(data.imageStatus);
  const list: string[] = [];
  if (TaskStatus.RUN.includes(status)) {
    list.push(DotButton.Crop, DotButton.Location);
  } else if (isCheckStatus(data)) {
    list.push(DotButton.Location);
  }
  return list;
}

export const scaleTipFormatter = function (value: string | number): string {
  return `${value}%`;
}

export enum DotDataType {
  Ocr = 1,
  Word,
  Comment
}

export class DotData {
  public id!: string | number;
  public taskId?: string;
  public imageId?: string;
  public imageName?: string;
  public imageFlag: string | number = "1"; // 类型， 默认框内
  public translatedText: string = "";      // 译文
  public coordinateType!: DotDataType;     // 标注类型 1: 带 OCR 翻译的文字录入， 2: 普通的文字录入, 3: 标注
  public remark: string = "";              // 备注
  constructor(
    public xCorrdinate1: number,
    public yCorrdinate1: number,
    public xCorrdinate2: number,
    public yCorrdinate2: number,
    public imageWidth: number,
    public imageHeight: number,
    public imagePath?: string,             // 选取的图片, 上传后的 URL 地址
    public originalText?: string,          // 原文 / 图片识别的文字内容
  ) {
    if (imagePath) {
      this.imageName = basename(imagePath); // 图片名称
    }
  }
}
