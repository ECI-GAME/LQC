import cache from "src/utils/cache";
import {PageResult} from "src/utils/model";
import safeGet from "@fengqiaogang/safe-get";
import {validate, required, Get, Post, tryError} from "@js-lion/api";

import type {DictItem} from "src/types";

export default class {
  /**
   * 枚举列表
   **/
  @tryError(new PageResult<object>())
  @cache(60 * 1000)
  @Get("/system/dict/data/type/:name")
  @validate
  getDictData<T = DictItem>(@required name: string): Promise<PageResult<T>> {
    const params = {name};
    const callback = function (value: object[] = []) {
      // @ts-ignore
      const list: T[] = [].concat([], value);
      return new PageResult<T>(list);
    };
    // @ts-ignore
    return {params, callback};
  }

  /**
   * OCR 识别
   **/
  @tryError(void 0)
  @Post("/ocrutil/identify", {responseType: "text"})
  @validate
  ocr(@required image: File, readOrder: string, language: string): Promise<string> {
    const data = new FormData();
    data.append("file", image);
    data.append("readOrder", readOrder);
    data.append("language", language);
    const callback = function (value: string | object) {
      if (typeof value === "string") {
        return value;
      }
      return safeGet<string>(value, "content");
    }

    // @ts-ignore
    return {data, callback};
  }


  //查询角色列表
  @Get("/system/role/list")
  getRoleList() {
    const params = {pageNum: 100, pageSize: 100};

    return {params};
  }
}