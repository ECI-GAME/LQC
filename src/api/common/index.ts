import * as message from "@ue/message";
import {Post, Put, validate, required, tryError} from "@js-lion/api";
import safeGet from "@fengqiaogang/safe-get";

export default class {
 
  @tryError(false)
  @message.$error()
  @message.$success("已翻译")
  @Post("/game/common/googleTruncate")
  @validate
  googleMt(@required data: object){
    
    return {data};
  }
}