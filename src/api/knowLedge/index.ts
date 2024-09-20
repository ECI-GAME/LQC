//知识库
import * as _ from "lodash-es";
import Graphql from "../graphql";
import {Gql, tryError} from "@js-lion/api";
import {PageResult} from "src/utils/model";
import safeGet from "@fengqiaogang/safe-get";

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

  /**
   * 知识库-文本资源
   * @returns UserInfo
   */
  @tryError(new PageResult())
  @Gql("/graphql")
  async textList(pageNum: number, projectId: number | string, versionId: number | string = 0, searchValue: string = "", pageSize: number = 10): Promise<PageResult<object>> {
    // 查询用户信息
    const data: string = `{
      getProjectTextResourcePage (input: { pageNum: ${pageNum},projectId: ${projectId},versionId:${versionId || 0},searchValue:"${searchValue}", pageSize: ${pageSize} }) {
        code
        rows
        msg
        total
      }
    }`;
    const callback = function (res: object) {
      return safeGet<object>(res, "getProjectTextResourcePage");
    }
    // @ts-ignore
    return {data, callback};
  }


}