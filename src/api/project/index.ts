/**
 * @file 用户相关接口
 * @author svon.me@gmail.com
 */

import { Delete, Get, Gql, post, tryError, validate } from "@js-lion/api";
import { $error, $success } from "@ue/message"

import { PageResult } from "src/utils/model";
import safeGet from "@fengqiaogang/safe-get";

export default class {
  /**
   * 用户详情
   * @returns UserIfno
   */
  @tryError([])
  @Gql("/graphql")
  async list(pageNum: number, searchValue: string = '', pageSize: number = 20): Promise<PageResult<object>> {
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
    return { data, callback };
  }

  //初始化项目
  @Get("/project/initProject")
  @validate
  projectInit() {
    // @ts-ignore
    return {};
  }



  //提交项目
  @tryError(false)
  @$error()
  @$success("操作成功")
  @post("/project")
  @validate
  addProject(data: object) {
    // @ts-ignore
    return { data };
  }


  //根据ID查询项目信息
  @Get("project/:projectId")
  @validate
  getProjectInfoById(data: number) {
    const params = { projectId: data };
    // @ts-ignore
    const callback = function (res: object) {
      return safeGet<object>(res, "data");
    }
    // @ts-ignore
    return { data, params };
  }

  //根据ID查询项目信息
  @Get("project/getProjectUser")
  @validate
  getProjectUserInfoBy() {

    return {};
  }




  //提交项目关联人员
  @tryError(false)
  @$error()
  @$success("操作成功")
  @post("/project/task/person")
  @validate
  addProjectUserInfoBy(data: object) {
    // @ts-ignore
    return { data };
  }


    //提交项目关联方法
    @tryError(false)
    @$error()
    @$success("操作成功")
    @post("/project/methods")
    @validate
    addProjecMethodInfoBy(data: object) {
      // @ts-ignore
      return { data };
    }


    
    //删除节点信息
    @tryError(false)
    @$error()
    @$success("操作成功")
    @Delete("project/methods/:ids")
    @validate
    deleteNode(data: number) {
      const params = { ids: data };
      // @ts-ignore
      const callback = function (res: object) {
        return safeGet<object>(res, "data");
      }
      // @ts-ignore
      return { data, params };
    }

  //根据ID查询项目关联方法
  @Get("project/methods/projectId/:id")
  @validate
  getProjectMethodById(data: number) {
    const params = { id: data };
    // @ts-ignore
    const callback = function (res: object) {
      return safeGet<object>(res, "data");
    }
    // @ts-ignore
    return { data, params };
  }
  



  //根据节点ID查询项目关联人员
  @Get("project/task/person/nodeId/:id")
  @validate
  getProjectPersonById(data: number) {
    const params = { id: data };
    // @ts-ignore
    const callback = function (res: object) {
      return safeGet<object>(res, "data");
    }
    // @ts-ignore
    return { data, params };
  }

    //删除人员信息
    @tryError(false)
    @$error()
    @$success("操作成功")
    @Delete("project/task/person/:ids")
    @validate
    deletePerson(data: number) {
      const params = { ids: data };
      // @ts-ignore
      const callback = function (res: object) {
        return safeGet<object>(res, "data");
      }
      // @ts-ignore
      return { data, params };
    }

     /**
   * 查询项目错误类型
   * @returns UserIfno
   */
  @tryError([])
  @Gql("/graphql")
  async projectErrorType(projectId: string): Promise<PageResult<object>> {
    // 查询用户信息
    const data: string = `{
      getProjectErrorTypeList (input: { projectId: ${projectId}}) {
        code
        data
        msg
      }
    }`;
    const callback = function (res: object) {
      const data = safeGet<object>(res, "getProjectErrorTypeList")
      return safeGet<object>(data, "data");
    }
    // @ts-ignore
    return { data, callback };
  }


    //根据节点ID查询项目PS配置
    @Get("system/psconfig/projectId/:id")
    @validate
    getProjectPSConfig(data: number) {
      const params = { id: data };
      // @ts-ignore
      const callback = function (res: object) {
        return safeGet<object>(res, "data");
      }
      // @ts-ignore
      return { data, params };
    }
}