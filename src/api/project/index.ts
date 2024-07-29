/**
 * @file 用户相关接口
 * @author svon.me@gmail.com
 */

import safeGet from "@fengqiaogang/safe-get";

import {Gql, tryError} from "@js-lion/api";

export default class {
  /**
   * 用户详情
   * @returns UserIfno
   */
  @tryError(void 0)
  @Gql("/graphql")
  async list(): Promise<object> {
    // 查询用户信息
    const data: string = `{ 
      user (nickname: "nickname") {
        mail
        nickname
        description
      } 
    }`;
    const callback = function (res: object) {
      return safeGet<object>(res, "user");
    }
    // @ts-ignore
    return {data, callback};
  }

}