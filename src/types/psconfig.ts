export interface PsConfig {
  searchValue?: string;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  remark: string | null;
  params: Record<string, string | number>;
  lang: string | null;
  id: number;
  category: string;
  font: string;
  fontSize: string;
  lineSpacing: string;
  textDirection: string;
  extraField1?: string;
  extraField2?: string;
  projectNumber: string;
}
