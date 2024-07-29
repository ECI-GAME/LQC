/**
 * @file 用户相关接口
 * @author svon.me@gmail.com
 */

import {Gql, tryError} from "@js-lion/api";

import {PageResult} from "src/utils/model";
import safeGet from "@fengqiaogang/safe-get";

export default class {
  /**
   * 用户详情
   * @returns UserIfno
   */
  @tryError([])
  @Gql("/graphql")
  async list(params: object): Promise<PageResult<object>> {
    const input = JSON.stringify(params);
    // 查询用户信息
    const data: string = `{
      qeuryComicProjectInfo (input: ${input}) {
        mail
        nickname
        description
      }
    }`;
    const callback = function (res: object) {
      return safeGet<object>(res, "qeuryComicProjectInfo");
    }
    // @ts-ignore
    return {data, callback};
  }

}