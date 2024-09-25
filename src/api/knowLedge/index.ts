/**
 * @file 知识库
 * @author svon.me@gmail.com
 **/

import * as _ from "lodash-es";
import Graphql from "../graphql";
import {PageResult} from "src/utils/model";
import {$error, $success} from "@ue/message";
import {tryError, Delete, validate, required} from "@js-lion/api";

import type {TextResource} from "src/types";

export default class extends Graphql {
  /**
   * 知识库-文件资源
   */
  @tryError(new PageResult())
  async list<T = object>(pageNum: number, projectId: number | string, versionId: number | string = 0, searchValue: string = "", resourceType: string, pageSize: number = 20): Promise<PageResult<T>> {
    const name = "knowledgeList";
    const input = {
      pageNum,
      pageSize,
      projectId,
      searchValue: _.trim(searchValue),
      versionId: Number(versionId || 0),
      resourceType: String(resourceType),
    }
    const keys = ["code", "rows", "total", "msg"];
    const res = await this.graphQL<object>(name, [{input}], keys);
    return new PageResult<T>(res);
  }

  @tryError(false)
  @$error()
  @$success("已删除")
  @Delete("/project/knowledge/remove/:id")
  @validate
  removeItem(@required id: string | number): Promise<boolean> {
    const params = {id};
    const callback = () => true;
    // @ts-ignore
    return {params, callback};
  }

  /**
   * 知识库-文本资源
   * @returns UserInfo
   */
  @tryError(new PageResult())
  async textList(pageNum: number, projectId: number | string, versionId: number | string = 0, searchValue: string = "", pageSize: number = 10): Promise<PageResult<TextResource>> {
    const input = {
      pageNum: Number(pageNum),
      pageSize: Number(pageSize),
      projectId: Number(projectId),
      versionId: versionId || 0,
      searchValue: String(searchValue || "").trim(),
    }
    const keys = ["code", "rows", "msg", "total"];
    const res = await this.graphQL<object>("getProjectTextResourcePage", [{input}], keys);
    return new PageResult<TextResource>(res);
  }


}