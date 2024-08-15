export interface LanguageData {
  createBy: string;
  createTime: string; // You might want to use `Date` type if processing dates
  updateBy: string | null;
  updateTime: string | null; // You might want to use `Date` type if processing dates
  lang: string | null;
  dictCode: number;
  dictSort: number;
  dictLabel: string;
  dictValue: string;
  dictType: string;
  status: string;
  code: string;
}