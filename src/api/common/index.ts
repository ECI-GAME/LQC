import * as message from "@ue/message";
import {Post, validate, required, tryError} from "@js-lion/api";

export default class {
  @tryError(false)
  @message.$error()
  @message.$success("已翻译")
  @Post("/game/common/googleTruncate")
  @validate
  googleMt(@required data: object): Promise<{ content: string }> {
    // @ts-ignore
    return {data};
  }
}