import {basename} from "src/utils/image";

export const DotType = {
  "1": "框内",
  "2": "框外"
}

export class DotData {
  public id!: string | number;
  public taskId?: string;
  public imageId?: string;
  public imageName?: string;
  public imageFlag: string | number = "1"; // 类型， 默认框内
  public translatedText: string = ""; // 译文
  constructor(
    public xCorrdinate1: number,
    public yCorrdinate1: number,
    public xCorrdinate2: number,
    public yCorrdinate2: number,
    public imageWidth: number,
    public imageHeight: number,
    public imagePath?: string,             // 选取的图片, 上传后的 URL 地址
    public originalText?: string,  // 原文 / 图片识别的文字内容
  ) {
    if (imagePath) {
      this.imageName = basename(imagePath);
    }
  }
}
