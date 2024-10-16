/**
 * @file 用户相关接口
 * @author svon.me@gmail.com
 */

import Graphql from "../graphql";
import cache from "src/utils/cache";
import {$error, $success} from "@ue/message";
import {API, Delete, Get, Post, Put, Gql, tryError, validate, required} from "@js-lion/api";

import {PageResult} from "src/utils/model";
import safeGet from "@fengqiaogang/safe-get";

import type {Project, PsConfig, VersionData, Remark} from "src/types";

export default class extends Graphql {
  /**
   * 用户详情
   * @returns UserIfno
   */
  @tryError([])
  @Gql("/graphql")
  async list(pageNum: number, searchValue: string = "", pageSize: number = 10): Promise<PageResult<object>> {
    // 查询用户信息
    const data: string = `{
      qeuryComicProjectInfo (input: { pageNum: ${pageNum}, searchValue:"${searchValue}",pageSize: ${pageSize} }) {
        code
        rows
        msg
        total
      }
    }`;
    const callback = function (res: object) {
      return safeGet<object>(res, "qeuryComicProjectInfo");
    }
    // @ts-ignore
    return {data, callback};
  }

  //初始化项目
  @tryError({})
  @Get("/project/initProject")
  @validate
  projectInit(): Promise<Project> {
    // @ts-ignore
    return {};
  }

  //根TaskID查询项目信息
  @Get("project/taskId/:taskId")
  @validate
  getProjectInfoByTId(data: number | string): Promise<Project> {
    const params = {taskId: data};
    // @ts-ignore
    return {params};
  }


  //提交项目
  @tryError(false)
  @$error()
  @$success("操作成功")
  @Post("/project")
  @validate
  addProject(data: object): Promise<boolean> {
    const callback = () => true;
    // @ts-ignore
    return {data, callback};
  }

  //提交项目
  @tryError(false)
  @$error()
  @$success("操作成功")
  @Post("/project/update")
  @validate
  updateProject(data: object): Promise<boolean> {
    const callback = () => true;
    // @ts-ignore
    return {data, callback};
  }

  //修改方法排序
  @tryError(false)
  @$error()
  @$success("操作成功")
  @Post("/project/methods/upSort")
  @validate
  updateProMethSort(data: Array<Object>): Promise<boolean> {
    // @ts-ignore
    return {data};
  }

  //根据ID查询项目信息
  @tryError({})
  @cache(1000 * 5)
  @Get("project/:id")
  @validate
  getProjectInfoById(@required projectId: number | string): Promise<Project> {
    const params = {id: projectId};
    // @ts-ignore
    return {params};
  }


  //根据ID查询项目信息
  @tryError([])
  @cache(1000 * 60)
  @Get("project/getProjectUser")
  @validate
  getProjectUserInfoBy<T = object>(): Promise<T[]> {
    // @ts-ignore
    return {};
  }


  //提交项目关联人员
  @tryError(false)
  @$error()
  @$success("操作成功")
  @Post("/project/task/person")
  @validate
  addProjectUserInfoBy(data: object): Promise<boolean> {
    const callback = () => true;
    // @ts-ignore
    return {data, callback};
  }


  //提交项目关联方法
  @tryError(false)
  @$error()
  @$success("操作成功")
  @Post("/project/methods")
  @validate
  addProjecMethodInfoBy(data: object): Promise<boolean> {
    const callback = () => true;
    // @ts-ignore
    return {data, callback};
  }


  //删除节点信息
  @tryError(false)
  @$error()
  @Delete("project/methods/:ids")
  @validate
  deleteNode(ids: number): Promise<boolean> {
    const params = {ids};
    // @ts-ignore
    const callback = () => true;
    // @ts-ignore
    return {params, callback};
  }

  //根据ID查询项目关联方法
  @tryError([])
  @Get("project/methods/projectId/:id")
  @validate
  getProjectMethodById(id: number | string): Promise<object[]> {
    const params = {id};
    // @ts-ignore
    return {params};
  }


  //根据节点ID查询项目关联人员
  @tryError([])
  @Get("project/task/person/nodeId/:id")
  @validate
  getProjectPersonById(id: number | string): Promise<object[]> {
    const params = {id};
    // @ts-ignore
    return {params};
  }

  //删除人员信息
  @tryError(false)
  @$error()
  @$success("操作成功")
  @Delete("project/task/person/:ids")
  @validate
  deletePerson(ids: number | string): Promise<boolean> {
    const params = {ids};
    // @ts-ignore
    const callback = () => true;
    // @ts-ignore
    return {params, callback};
  }

  /**
   * 查询项目错误类型
   * @returns UserIfno
   */
  @tryError([])
  @validate
  async projectErrorType<T = Remark>(@required projectId: string | number): Promise<PageResult<T>> {
    const name = "getProjectErrorTypeList";
    const input = {projectId: Number(projectId)};
    const res = await this.graphQL<{ data: T[] }>(name, {input}, ["data"]);
    return new PageResult<T>(safeGet<T[]>(res, "data"));
  }


  //根据节点ID查询项目PS配置
  @tryError(new PageResult())
  @Get("system/psconfig/projectId/:id")
  @validate
  getProjectPSConfig(@required value: number | string): Promise<PageResult<PsConfig>> {
    const params = {id: value};
    const callback = function (value: PsConfig[]) {
      return new PageResult<PsConfig>(value);
    };
    // @ts-ignore
    return {params, callback};
  }


  //根据ID查询项目信息
  @Get("game/common/ocr")
  @validate
  ocrResult(data: string) {
    const params = {message: data};
    return {data, params};
  }


  //提交项目关联方法
  @tryError(false)
  @$error()
  @$success("操作成功")
  @validate
  async addProjectPSErrorData(data: object): Promise<boolean> {
    const api = new API();
    try {
      await api.post("/project/error/type", data);
      return true;
    } catch (e) {
      return false;
    }
  }


  //删除人员信息
  @tryError(false)
  @$error()
  @$success("操作成功")
  @Delete("project/error/type/:ids")
  @validate
  delProjectPSErrorData(data: number): Promise<boolean> {
    const params = {ids: data};
    const callback = () => true;
    // @ts-ignore
    return {params, callback};
  }


  //提交项目关联方法
  @tryError(false)
  @$error()
  @$success("操作成功")
  @Post("/system/psconfig/update")
  @validate
  updateProjectPSErrorData(data: PsConfig[]): Promise<boolean> {
    // @ts-ignore
    return {data};
  }


  //版本列表
  @tryError(new PageResult<VersionData>())
  @cache(30 * 1000)
  @Get("project/getVersionDict/:projectId")
  @validate
  getVersionDict(@required projectId: number | string): Promise<PageResult<VersionData>> {
    const params = {projectId};
    const callback = function (res: VersionData[]) {
      return new PageResult<VersionData>(res);
    }
    // @ts-ignore
    return {params, callback};
  }


  //提交项目关联方法
  @tryError(false)
  @$error()
  @$success("上传成功")
  @Post("/project/knowledge/upload")
  @validate
  addKnowLedgeInfo(data: object): Promise<boolean> {
    const callback = () => true;
    // @ts-ignore
    return {data, callback};
  }


  //模板导出
  @Get("/project/text/export/textTmp")
  @validate
  exportTextResource() {

    // @ts-ignore
    const callback = function (res: object) {
      return safeGet<object>(res, "data");
    }
    // @ts-ignore
    return {};
  }


  //模板导入
  @tryError()
  @$error()
  @$success("操作成功")
  @Post("/project/text/upload/textResource")
  @validate
  importTextResource(@required data: object): Promise<boolean> {
    // @ts-ignore
    return {data};
  }

  //提交语言内容
  @tryError(false)
  @$error()
  @$success("操作成功")
  @Post("/project/text")
  @validate
  addTextReource(@required data: object): Promise<boolean> {
    const callback = () => true;
    // @ts-ignore
    return {data, callback};
  }

  //编辑语言内容
  @tryError(false)
  @$error()
  @$success("操作成功")
  @Put("/project/text")
  @validate
  updateTextReource(@required data: object): Promise<boolean> {
    const callback = () => true;
    // @ts-ignore
    return {data, callback};
  }

  //删除语言内容
  @tryError(false)
  @$error()
  @$success("操作成功")
  @Delete("/project/text/:id")
  @validate
  removeTextReource(@required id: string | number): Promise<boolean> {
    const params = {id};
    const callback = () => true;
    // @ts-ignore
    return {params, callback};
  }

  //提交语言内容
  @tryError(false)
  @$error()
  @$success("操作成功")
  @Post("/system/emp/add/project/participants")
  @validate
  invitePerson(@required data: object): Promise<boolean> {
    const callback = () => true;
    // @ts-ignore
    return {data, callback};
  }
}