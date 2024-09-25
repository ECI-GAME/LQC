import Word from "./word";
import GraphQL from "../graphql";
import loading from "src/utils/loading";
import * as message from "@ue/message";
import {PageResult} from "src/utils/model";
import {validate, required, Put, Post, tryError} from "@js-lion/api";


export default class extends GraphQL {
  word: Word = new Word();

  @validate
  async getImages<T>(@required versionId: string | number): Promise<PageResult<T>> {
    const name: string = "getProjectTaskImageRelationsList";
    const query = {
      "input": `{ taskId: ${versionId}, pageNum: 1, pageSize: 10000 }`
    };
    const res = await this.graphQL<{ rows: T[] }>(name, [query], ["rows"]);
    return new PageResult<T>(res.rows);
  }

  /**
   * 根据图片ID查询文字记录点列表
   */
  @validate
  async getDotList<T>(@required imageId: string | number, coordinateType?: string | number): Promise<PageResult<T>> {
    const name: string = "getProjectImageTranslationsList";
    const query = {
      "input": coordinateType ? `{ imageId: ${imageId}, coordinateType: ${coordinateType} }` : `{ imageId: ${imageId}, coordinateType: 0 }`
    };
    const res = await this.graphQL<{ data: T[] }>(name, [query], ["data"]);
    if (res) {
      return new PageResult<T>(res.data);
    }
    return new PageResult<T>();
  }

  /**
   * 单张图片标记节点数据的保存
   **/
  @tryError(false)
  @message.$error()
  @message.$success("操作成功")
  @Put("/project/task/relations")
  @validate
  onSave(@required workId: string | number): Promise<boolean> {
    const callback = () => true;
    const data = {
      id: workId, // 图片ID
      isFinish: 1
    };
    // @ts-ignore
    return {data, callback};
  }

  /**
   * 提交任务
   **/
  @tryError(false)
  @message.$error()
  @message.$success("已提交")
  @loading()
  @Post("/project/tasks/submit")
  @validate
  onSubmit(@required data: object): Promise<boolean> {
    const callback = () => true;
    // @ts-ignore
    return {data, callback};
  }
}