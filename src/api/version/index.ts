/**
 * @file 用户相关接口
 * @author svon.me@gmail.com
 */

import { Get, Gql, post, tryError, validate } from "@js-lion/api";

import { PageResult } from "src/utils/model";
import safeGet from "@fengqiaogang/safe-get";
import { $error, $success } from "@ue/message"

export default class {
  /**
   * 画册集合
   * @returns UserInfo
   */
  @tryError([])
  @Gql("/graphql")
  async list(pageNum: number, projectId: number, pageSize: number = 20): Promise<PageResult<object>> {
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
    return { data, callback };
  }



  //提交画册
  @tryError(false)
  @$error()
  @$success("操作成功")
  @post("/project/version")
  @validate
  addVersion(data: object) {
    const callback = function (res: object) {
      return safeGet<number>(res, "code");
    }
    // @ts-ignore
    return { data };
  }

  //添加画册图片
  @post("/project/images/batchAdd")
  @validate
  addVersionImage(data: object) {
    const callback = function (res: object) {
      return safeGet<number>(res, "code");
    }
    // @ts-ignore
    return { data };
  }



  //根据ID查询画册信息
  @Get("project/version/:id")
  @validate
  geVersionInfoById(data: number) {
    const params = { id: data };
    // @ts-ignore
    const callback = function (res: object) {
      return safeGet<object>(res, "data");
    }
    // @ts-ignore
    return { data, params };
  }
  
  //查询所有版本信息
  @Get("project/version/versions/:projectId")
  @validate
  geVersionInfoByPId(data: number) {
    const params = { projectId: data };
    // @ts-ignore
    const callback = function (res: object) {
      return safeGet<object>(res, "data");
    }
    // @ts-ignore
    return { data, params };
  }

  //根据ID查询画册图片信息
  @Get("project/images/versionId/:versionId")
  @validate
  geVersionImageById(data: number) {
    const params = { versionId: data };
    // @ts-ignore
    const callback = function (res: object) {
      return safeGet<object>(res, "data");
    }
    // @ts-ignore
    return { data, params };
  }

  //根据ID查询画册图片详细信息
  @Get("project/images/detail/:versionId")
  @validate
  geVersionImageDeailByVId(data: number) {
    const params = { versionId: data };
    // @ts-ignore
    const callback = function (res: object) {
      return safeGet<object>(res, "data");
    }
    // @ts-ignore
    return { data, params };
  }


}