/**
 * @file 用户相关接口
 * @author svon.me@gmail.com
 */

import {Get, Gql, post, tryError, validate} from "@js-lion/api";
import { $error, $success } from "@ue/message"

import {PageResult} from "src/utils/model";
import safeGet from "@fengqiaogang/safe-get";

export default class {
  /**
   * 用户详情
   * @returns UserIfno
   */
  @tryError([])
  @Gql("/graphql")
  async list(pageNum: number, searchValue:string='', pageSize: number = 20): Promise<PageResult<object>> {
    // 查询用户信息
    const data: string = `{
      qeuryComicProjectInfo (input: { pageNum: ${pageNum}, searchValue:"${searchValue}",pageSize: ${pageSize} }) {
        code
        rows
        msg
      }
    }`;
    const callback = function (res: object) {
      return safeGet<object>(res, "qeuryComicProjectInfo");
    }
    // @ts-ignore
    return {data, callback};
  }

  //初始化项目
  @Get("/project/initProject")
  @validate
  projectInit ( ) {
    // @ts-ignore
    return {};
  }



  //提交项目
  @tryError(false)
  @$error()
  @$success("操作成功")
  @post("/project")
  @validate
  addProject (data:object) {
    // @ts-ignore
    return {data};
  }

  
  //根据ID查询项目信息
  @Get("project/:projectId")
  @validate
  getProjectInfoById ( data: number) {
    const params = { projectId: data };
    // @ts-ignore
    const callback = function (res: object) {
      return safeGet<object>(res, "data");
    }
    // @ts-ignore
    return {data, params};
  }
}