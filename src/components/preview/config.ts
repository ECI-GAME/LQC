export class DotData {
  constructor(
    public x1: number,
    public y1: number,
    public x2: number,
    public y2: number,
    public image?: string,             // 选取的图片, 上传后的 URL 地址
    public translatedText?: string,  // 图片识别的文字内容
  ) {

  }
}