export enum CheckCode {
  Disable = "1",
  Translation = "2"
}

export interface CheckType {
  checkTypeCode: CheckCode;         // 1 表示禁用, 2 表示术语
  index: number;                   // 检查文字的开始下标
  word: string;                    // 匹配的关键词
  suggestTranslation: string;      // 匹配术语文案
}

/* 标记电修改记录 */
export interface DotCheckData {
  id: number;
  originalText: string;
  changeText: string;
  createTime: number;
  createBy: string;
  translationId: number;
  imageId: number;
}