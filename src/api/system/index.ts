import {validate, required, Get} from "@js-lion/api";
import type {PageResult} from "src/utils/model";

export default class {

  @Get("/system/dict/data/type/:lang")
  @validate
  getDictData(@required key: string): Promise<PageResult<object>> {
    const params = {lang: key};
    // @ts-ignore
    return {params};
  }


}