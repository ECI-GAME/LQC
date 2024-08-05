//知识库
import {Get, Gql, post, tryError, validate} from "@js-lion/api";

import {PageResult} from "src/utils/model";
import safeGet from "@fengqiaogang/safe-get";
import { $error, $success } from "@ue/message"

export default class {
  /**
   * 知识库-文件资源
   * @returns UserInfo
   */
  @tryError([])
  @Gql("/graphql")
  async list(pageNum: number, typeId:number ,pageSize: number = 20): Promise<PageResult<object>> {
    // 查询用户信息
    const data: string = `{
      knowledgeList (input: { pageNum: ${pageNum},typeId: ${typeId}, pageSize: ${pageSize} }) {
        code
        rows
        msg
      }
    }`;
    const callback = function (res: object) {
      return safeGet<object>(res, "knowledgeList");
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
  async textList(pageNum: number, projectId:number ,pageSize: number = 20): Promise<PageResult<object>> {
    // 查询用户信息
    const data: string = `{
      getProjectTextResourcePage (input: { pageNum: ${pageNum},projectId: ${projectId}, pageSize: ${pageSize} }) {
        code
        rows
        msg
      }
    }`;
    const callback = function (res: object) {
      return safeGet<object>(res, "getProjectTextResourcePage");
    }
    // @ts-ignore
    return {data, callback};
  }

  
}