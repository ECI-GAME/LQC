import {basename} from "src/utils/image";

export const DotType = {
  "1": "框内",
  "2": "框外"
}

export const scaleTipFormatter = function (value: string | number): string {
  return `${value}%`;
}

export enum DotDataType {
  Ocr = 1,
  Word,
  Comment
}

export enum DotMatchType {
  not= 1,
  match,
  update,
  noUpdate
}

export class DotData {
  public id!: string | number;
  public taskId!: string;
  public imageId!: string | number;
  public imageName?: string;
  public imageFlag: string | number = "1"; // 类型， 默认框内
  public translatedText: string = "";      // 译文
  public translatedHtml: string = "";
  public originalText: string = "";       // 原文 / 图片识别的文字内容
  public originalHtml: string = "";
  public coordinateType!: DotDataType;     // 标注类型 1: 带 OCR 翻译的文字录入， 2: 普通的文字录入, 3: 标注
  public remark: string = "";              // 备注
  public matchType?: DotMatchType;
  constructor(
    public xCorrdinate1: number,
    public yCorrdinate1: number,
    public xCorrdinate2: number,
    public yCorrdinate2: number,
    public imageWidth: number,
    public imageHeight: number,
    public imagePath?: string,             // 选取的图片, 上传后的 URL 地址
    originalText: string = "",          // 原文 / 图片识别的文字内容
  ) {
    if (imagePath) {
      this.imageName = basename(imagePath); // 图片名称
    }
    this.originalHtml = originalText;
    this.originalText = originalText;
  }
}
