import Word from "./word";
import GraphQL from "../graphql";
import * as message from "@ue/message";
import {PageResult} from "src/utils/model";
import {validate, required, Put, tryError} from "@js-lion/api";


export default class extends GraphQL {
  word: Word = new Word();

  @validate
  async getImages<T>(@required versionId: string | number): Promise<PageResult<T>> {
    const name: string = "getProjectTaskImageRelationsList";
    const query = {
      "input": `{ id: ${versionId}, pageNum: 1, pageSize: 10000 }`
    };
    const res = await this.graphQL<{ rows: T[] }>(name, [query], ["rows"]);
    return new PageResult<T>(res.rows);
  }

  /**
   * 根据图片ID查询文字记录点列表
   */
  @validate
  async getDotList<T>(@required imageId: string | number): Promise<PageResult<T>> {
    const name: string = "getProjectImageTranslationsList";
    const query = {
      "input": `{ imageId: ${imageId} }`
    };
    const res = await this.graphQL<{ data: T[] }>(name, [query], ["data"]);
    return new PageResult<T>(res.data);
  }

  @tryError(false)
  @message.$error()
  @message.$success("已保存")
  @Put("/project/task/relations")
  @validate
  onSave(@required workId: string | number): Promise<boolean> {
    const callback = () => true;
    const data = {
      id: workId,
      isFinish: 1
    };
    // @ts-ignore
    return {data, callback};
  }
}