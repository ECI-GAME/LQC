import Word from "./word";
import GraphQL from "../graphql";
import {PageResult} from "src/utils/model";


export default class extends GraphQL {
  word: Word = new Word();

  /**
   * 根据图片ID查询文字记录点列表
   */
  async getDotList<T>(imageId: string | number): Promise<PageResult<T>> {
    const name: string = "getProjectImageTranslationsList";
    const query = {
      "input": `{ imageId: ${imageId} }`
    };
    const res = await this.graphQL<{ data: T[] }>(name, [query], ["data"]);
    return new PageResult<T>(res.data);
  }
}