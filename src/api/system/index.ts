import safeGet from "@fengqiaogang/safe-get";
import { $success, $error } from "@ue/message";
import {Gql, tryError, Post, validate, required, Get} from "@js-lion/api";

export default class {
  
  @Get("/system/dict/data/type/:lang")
  @validate
  getDictData ( data: object) {
    const params = { lang: data };
    // // @ts-ignore
    // const callback = function (res: object) {
    //   return safeGet<object>(res, "data");
    // }
    // @ts-ignore
    return {data, params};
  }



  
}