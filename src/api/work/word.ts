import * as message from "@ue/message";
import {PageResult} from "src/utils/model";
import {Get, Post, Delete, Put, validate, required, tryError} from "@js-lion/api";
import type {DotCheckData, CheckType} from "src/types";

export default class {
  @tryError(false)
  @message.$error()
  @message.$success("已删除")
  @Delete("/project/image/translations/:id")
  @validate
  remove(@required nodeId: string | number): Promise<boolean> {
    const params = {id: nodeId};
    const callback = () => true;
    // @ts-ignore
    return {params, callback};
  }

  @tryError(false)
  @message.$error()
  @message.$success("已保存")
  @Post("/project/image/translations")
  @validate
  add(@required data: object): Promise<boolean> {
    const callback = () => true;
    // @ts-ignore
    return {data, callback};
  }

  /** 正常情况下修改标记信息 */
  @tryError(false)
  @message.$error()
  @message.$success("已修改")
  @Put("/project/image/translations")
  @validate
  update(@required data: object): Promise<boolean> {
    const callback = () => true;
    // @ts-ignore
    return {data, callback};
  }

  /** 审核状态中编辑标记信息 */
  @tryError(false)
  @message.$error()
  @message.$success("已修改")
  @Put("/project/image/check/insureCheck")
  @validate
  updateCheck(@required data: object): Promise<boolean> {
    const callback = () => true;
    // @ts-ignore
    return {data, callback};
  }

  /**
   * 内容关键字检查
   **/
  @tryError([])
  @Post("/project/image/translations/words/check")
  @validate
  check(@required projectId: string | number, keyword?: string): Promise<CheckType[]> {
    const data: object = {text: keyword, projectId};
    // @ts-ignore
    return {data};
  }

  // 标记数据修改记录
  @tryError(new PageResult<DotCheckData>())
  @Get("/project/image/check/pageList")
  @validate
  dotCheckList(@required dotId: string | number, @required imageId: string | number): Promise<PageResult<DotCheckData>> {
    const params: object = {imageId, translationId: dotId, pageNum: 1, pageSize: 1000};
    // @ts-ignore
    return {params};
  }
}