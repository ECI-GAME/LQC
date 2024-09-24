/**
 * @file 用户相关接口
 * @author svon.me@gmail.com
 */


import Graphql from "../graphql";
import {PageResult} from "src/utils/model";
import safeGet from "@fengqiaogang/safe-get";
import {$error, $success} from "@ue/message";
import {Delete, Get, Gql, Post, Put, post, tryError, validate, required} from "@js-lion/api";


export default class extends Graphql {
  /**
   * 画册集合
   * @returns UserInfo
   */
  @tryError([])
  @Gql("/graphql")
  async list<T = object>(pageNum: number, projectId: number | string, pageSize: number = 3): Promise<PageResult<T>> {
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
      return safeGet<T>(res, "getProjectVersionPageList");
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
  addVersion(data: object): Promise<boolean> {
    const callback = () => true;
    // @ts-ignore
    return {data, callback};
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
  @$error()
  @$success("上传成功")
  @post("/project/images/batchAdd")
  @validate
  addVersionImage(@required data: object): Promise<boolean> {
    const callback = () => true;
    // @ts-ignore
    return {data, callback};
  }


  //根据ID查询画册信息
  @tryError(void 0)
  @Get("project/version/:id")
  @validate
  geVersionInfoById<T = object>(id: number | string): Promise<T> {
    const params = {id};
    // @ts-ignore
    return {params};
  }

  //根据ID删除画册信息
  @tryError(false)
  @$error()
  @$success("操作成功")
  @Delete("project/images/:id")
  @validate
  deleteImageByVid(id: number | string): Promise<boolean> {
    const params = {id};
    const callback = () => true;
    // @ts-ignore
    return {params, callback};
  }

  //查询所有版本信息
  @Get("project/version/versions/:projectId")
  @validate
  geVersionInfoByPId(projectId: number | string) {
    const params = {projectId};
    // @ts-ignore
    return {params};
  }

  //根据ID查询画册图片信息
  @tryError(new PageResult())
  @Get("project/images/versionId/:versionId")
  @validate
  geVersionImageById<T = object>(@required versionId: number | string): Promise<PageResult<T>> {
    const params: object = {versionId};
    const callback = function (data: T[]) {
      return new PageResult<T>(data);
    }
    // @ts-ignore
    return {params, callback};
  }


  /** 图片名称重名检查 */
  @tryError(false)
  @Post("project/images/checkName")
  @validate
  private imageNameCheck(@required versionId: number | string, @required fileName: string): Promise<boolean> {
    const data = {versionId: versionId, imageName: fileName};
    const callback = (value: number) => {
      return !(value || value > 0);
    }
    // @ts-ignore
    return {data, callback};
  }

  /** 图片名称重名检查 */
  @$error()
  @validate
  async checkImage(@required versionId: number | string, @required fileName: string): Promise<boolean> {
    const status = await this.imageNameCheck(versionId, fileName);
    if (status) {
      return status;
    } else {
      const text = `文件名称重复，请重命名：${fileName}`;
      return Promise.reject(new Error(text));
    }
  }


  // 根据ID查询画册图片详细信息-分页
  @tryError([])
  async geVersionImageDetailPage(versionId: number | string = 0, projectId: number | string, pageNum: number, pageSize: number = 10, imageName?: string): Promise<PageResult<object>> {
    // 方法名称
    const name = "getProjectVersionImagesList";
    // 所需字段
    const keys = ["code", "rows", "total", "msg"];
    // 查询条件
    const input = {
      pageNum: Number(pageNum),
      pageSize: Number(pageSize),
      versionId: Number(versionId),
      projectId: Number(projectId),
      imageName: String(imageName || "").trim(),
    };
    return this.graphQL(name, {input}, keys);
  }
}