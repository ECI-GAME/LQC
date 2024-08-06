import {Post, Put, validate, required, tryError} from "@js-lion/api";
import * as message from "@ue/message";

export default class {
  @tryError(false)
  @message.$error()
  @message.$success("已保存")
  @Post("/project/image/translations")
  @validate
  add(@required data: object): Promise<boolean> {
    // @ts-ignore
    return {data};
  }

  @tryError(false)
  @message.$error()
  @message.$success("已修改")
  @Put("/project/image/translations")
  @validate
  update(@required data: object): Promise<boolean> {
    // @ts-ignore
    return {data};
  }
}