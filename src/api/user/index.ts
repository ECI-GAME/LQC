/**
 * @file 用户相关接口
 * @author svon.me@gmail.com
 */

import * as _ from "lodash-es";
import {$success, $error} from "@ue/message";
import safeGet from "@fengqiaogang/safe-get";
import {tryError, Post, Get, validate, required} from "@js-lion/api";

import type {UserInfo} from "types/user";

export default class {
  @tryError(void 0)

  @Post("/xxxx")
  @validate
  demo(@required data: object) {
    const params = data;
    // @ts-ignore
    return {params};
  }

  @tryError(void 0)
  @$error("服务器异常, 请稍后再试")
  @$success("用户信息修改成功")
  @Post("/user/:id/:name")
  @validate
  update(@required data: object) {
    const params = {id: 123};
    // @ts-ignore
    return {data, params};
  }


  /**
   * 用户详情
   * @returns UserIfno
   */
  @tryError(void 0)
  @Get("/system/emp/getuser")
  async info(): Promise<UserInfo> {
    const callback = (data: UserInfo): UserInfo => {
      let apps = ["lqa_game", "ecis_comic"];
      const text = safeGet<string>(data, "systemType");
      if (text) {
        const list = _.map(text.split(":"), (value: string) => _.trim(value));
        apps = _.compact(list);
      }
      return {...data, apps};
    }
    // @ts-ignore
    return {callback};
  }

}