/**
 * @file 用户相关接口
 * @author svon.me@gmail.com
 */

import {Delete, Get, Gql, Post, Put, post, tryError, validate, required} from "@js-lion/api";

import {PageResult} from "src/utils/model";
import safeGet from "@fengqiaogang/safe-get";
import {$error, $success} from "@ue/message";


import type {ProjectImage} from "src/types";

export default class {
  /**
   * 画册集合
   * @returns UserInfo
   */
  @tryError([])
  @Gql("/graphql")
  async list(pageNum: number, projectId: number | string, pageSize: number = 3): Promise<PageResult<object>> {
    // 查询用户信息
    const data: string = `{
      getProjectVersionPageList (input: { pageNum: ${pageNum},projectId: ${projectId}, pageSize: ${pageSize} }) {
        code
        rows
        msg
        total
      }
    }`;
    const callback = function (res: object) {
      return safeGet<object>(res, "getProjectVersionPageList");
    }
    // @ts-ignore
    return {data, callback};
  }


  //提交画册
  @tryError(false)
  @$error()
  @$success("操作成功")
  @post("/project/version")
  @validate
  addVersion(data: object) {
    // @ts-ignore
    return {data};
  }

  //修改画册
  @tryError(false)
  @$error()
  @$success("操作成功")
  @Put("/project/version")
  @validate
  updateVersion(data: object) {
    // @ts-ignore
    return {data};
  }

  //添加画册图片
  @tryError(false)
  @post("/project/images/batchAdd")
  @validate
  addVersionImage(@required data: object): Promise<boolean> {
    const callback = function() {
      return true;
    }
    // @ts-ignore
    return {data, callback};
  }


  //根据ID查询画册信息
  @Get("project/version/:id")
  @validate
  geVersionInfoById<T = object>(data: number | string): Promise<T> {
    const params = {id: data};
    // @ts-ignore
    return {params};
  }

  //根据ID删除画册信息
  @tryError(false)
  @$error()
  @$success("操作成功")
  @Delete("project/images/:id")
  @validate
  deleteImageByVid(data: number) {
    const params = {id: data};
    return {data, params};
  }

  //查询所有版本信息
  @Get("project/version/versions/:projectId")
  @validate
  geVersionInfoByPId(data: number) {
    const params = {projectId: data};
    // @ts-ignore
    const callback = function (res: object) {
      return safeGet<object>(res, "data");
    }
    // @ts-ignore
    return {data, params};
  }

  //根据ID查询画册图片信息
  @tryError(new PageResult())
  @Get("project/images/versionId/:versionId")
  @validate
  geVersionImageById<T = object>(@required versionId: number | string): Promise<PageResult<T>> {
    const params: object = {versionId};
    const callback = function(data: T[]) {
      return new PageResult<T>(data);
    }
    // @ts-ignore
    return {params, callback};
  }

  //图片名称重名检查
  @Post("project/images/checkName")
  @validate
  checkImage(versionId: number, imageName: string) {
    const data = {versionId: versionId, imageName: imageName};
    return {data};
  }


  // //根据ID查询画册图片详细信息-分页
  // @post("project/images/list")
  // @validate
  // geVersionImageDetailPage(data: object) {
  //   const callback = function (res: object) {
  //     console.log('res');
  //     console.log(res);
  //     return safeGet<object>(res, "rows");
  //   }

  //   return { data,callback};
  // }

  @tryError([])
  @Gql("/graphql")
  async geVersionImageDetailPage(versionId: number = 0, pageNum: number, pageSize: number = 10, projectId: number, imageName: string = ""): Promise<PageResult<object>> {
    // 查询用户信息
    const data: string = `{
      getProjectVersionImagesList (input: { pageNum: ${pageNum}, versionId:${versionId},pageSize: ${pageSize},imageName: "${imageName}" }) {
        code
        rows
        msg
        total
      }
    }`;
    const callback = function (res: object) {
      return safeGet<object>(res, "getProjectVersionImagesList");
    }
    // @ts-ignore
    return {data, callback};
  }


}