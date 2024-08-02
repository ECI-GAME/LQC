import {validate, required, Get, Post, tryError} from "@js-lion/api";
import type {PageResult} from "src/utils/model";

export default class {

  @Get("/system/dict/data/type/:lang")
  @validate
  getDictData(@required key: string): Promise<PageResult<object>> {
    const params = {lang: key};
    // @ts-ignore
    return {params};
  }

  @tryError(void 0)
  @Post("/ocrutil/identify", {responseType: "text"})
  @validate
  ocr(@required image: File): Promise<string> {
    const data = new FormData();
    data.append("file", image);

    const callback = function (value: string) {
      return value;
    }

    // @ts-ignore
    return {data, callback};
  }
}