import * as message from "@ue/message";
import safeGet from "@fengqiaogang/safe-get";
import {DBList} from "@fengqiaogang/dblist";
import {Get, Post, validate, required, tryError} from "@js-lion/api";

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

  @Get("/system/menu/getRoutersMenu")
  getMenus(): Promise<object[]> {
    const callback = function (data: object) {
      const list = safeGet<object[]>(data, "menu") || [];
      const db = new DBList();
      db.insert(list);
      return db.select({menuType: "C"});
    }
    // @ts-ignore
    return {callback};
  }
}