/**
 * @file 用户相关接口
 * @author svon.me@gmail.com
 */

import {Get, Gql, post, tryError, validate} from "@js-lion/api";

import {PageResult} from "src/utils/model";
import safeGet from "@fengqiaogang/safe-get";

export default class {
  /**
   * 版本集合
   * @returns UserInfo
   */
  @tryError([])
  @Gql("/graphql")
  async list(pageNum: number, projectId:number ,pageSize: number = 20): Promise<PageResult<object>> {
    // 查询用户信息
    const data: string = `{
      getProjectVersionPageList (input: { pageNum: ${pageNum},projectId: ${projectId}, pageSize: ${pageSize} }) {
        code
        rows
        msg
      }
    }`;
    const callback = function (res: object) {
      return safeGet<object>(res, "getProjectVersionPageList");
    }
    // @ts-ignore
    return {data, callback};
  }



  //提价项目
  @post("/project")
  @validate
  addProject (data:object) {
    const callback = function (res: object) {
      return safeGet<number>(res, "code");
    }
    // @ts-ignore
    return {data};
  }

  
  //根据ID查询版本信息
  @Get("project/version/:id")
  @validate
  geVersionInfoById ( data: number) {
    const params = { id: data };
    // @ts-ignore
    const callback = function (res: object) {
      return safeGet<object>(res, "data");
    }
    // @ts-ignore
    return {data, params};
  }
}