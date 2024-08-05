import {Post, validate, required, tryError} from "@js-lion/api";
import * as message from "@ue/message";

export default class {
  @tryError(false)
  @message.$error()
  @message.$success("已保存")
  @Post("/project/image/translations")
  @validate
  add(@required data: object): Promise<boolean> {
    const callback = function(value: any) {
      console.log(value)
    };
    // @ts-ignore
    return {data, callback};
  }
}