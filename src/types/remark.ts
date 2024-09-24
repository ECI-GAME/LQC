export interface Remark {
  errorTypeName: string;
  id: number;
  projectId: number;
  errorTypeParent: number;
  errorTypeSort: number;
  childrenList: Remark[];
}