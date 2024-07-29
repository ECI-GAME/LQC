/**
 * @file 用户相关接口
 * @author svon.me@gmail.com
 */

import safeGet from "@fengqiaogang/safe-get";
import { $success, $error } from "@ue/message";
import {Gql, tryError, Post, validate, required} from "@js-lion/api";

export default class {
  @tryError(void 0)

  @Post("/xxxx")
  @validate
  demo (@required data: object) {
    const params = data;
    // @ts-ignore
    return {params};
  }

  @tryError(void 0)
  @$error("服务器异常, 请稍后再试")
  @$success("用户信息修改成功")
  @Post("/user/:id/:name")
  @validate
  update (@required data: object) {
    const params = { id: 123 };
    // @ts-ignore
    return {data, params};
  }
  /**
   * 用户详情
   * @returns UserIfno
   */
  @tryError(void 0)
  @Gql("/graphql")
  async info(): Promise<object> {
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