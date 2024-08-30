//知识库
import {Gql, tryError} from "@js-lion/api";

import {PageResult} from "src/utils/model";
import safeGet from "@fengqiaogang/safe-get";

export default class {
  /**
   * 知识库-文件资源
   */
  @tryError(new PageResult<object>)
  @Gql("/graphql")
  async list(pageNum: number, projectId: number | string, versionId: number = 0, searchValue: string = "", resourceType: string, pageSize: number = 20): Promise<PageResult<object>> {
    // 查询用户信息
    const data: string = `{
      knowledgeList (input: { pageNum: ${pageNum},projectId: ${projectId},versionId:${versionId || 0},searchValue:"${searchValue}",resourceType:"${resourceType}", pageSize: ${pageSize} }) {
        code
        rows
        msg
        total
      }
    }`;
    const callback = function (res: object) {
      const value = safeGet<object>(res, "knowledgeList");
      return new PageResult<object>(value);
    }
    // @ts-ignore
    return {data, callback};
  }

  /**
   * 知识库-文本资源
   * @returns UserInfo
   */
  @tryError([])
  @Gql("/graphql")
  async textList(pageNum: number, projectId: number | string, versionId: number = 0, searchValue: string = "", pageSize: number = 10): Promise<PageResult<object>> {
    // 查询用户信息
    const data: string = `{
      getProjectTextResourcePage (input: { pageNum: ${pageNum},projectId: ${projectId},versionId:${versionId || 0},searchValue:"${searchValue}", pageSize: ${pageSize} }) {
        code
        rows
        msg
        total
      }
    }`;
    const callback = function (res: object) {
      return safeGet<object>(res, "getProjectTextResourcePage");
    }
    // @ts-ignore
    return {data, callback};
  }


}