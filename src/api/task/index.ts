import {PageResult} from "src/utils/model";
import {$error, $success} from "@ue/message"
import safeGet from "@fengqiaogang/safe-get";
import {Get, Gql, post, tryError, validate, required} from "@js-lion/api";

import type {TaskData} from "src/types/task";

export default class {

  //任务列表查询
  @tryError([])
  @Gql("/graphql")
  async list(pageNum: number = 1, versionId?: number, pageSize: number = 20): Promise<PageResult<object>> {
    const data: string = `{
      getProjectTasksList (input: { pageNum: ${pageNum},versionId:${versionId || 0}, pageSize: ${pageSize} }) {
        code
        rows
        msg
      }
    }`;
    const callback = function (res: object) {
      return safeGet<object>(res, "getProjectTasksList");
    }
    // @ts-ignore
    return {data, callback};
  }


  //提交任务
  @tryError(false)
  @$error()
  @$success("操作成功")
  @post("/project/tasks/submit")
  @validate
  submitTask(data: object) {
    // @ts-ignore
    return {data};
  }

  //根据ID查询画册信息
  @tryError(new PageResult<object>())
  @Get("/project/task/relations/tasks/:id")
  @validate
  getTaskInfoDetailById(@required taskId: number | string): Promise<PageResult<object>> {
    const params = {id: taskId};
    // @ts-ignore
    return {params};
  }

  //根据ID查询画册信息
  @tryError({})
  @Get("/project/tasks/:id")
  @validate
  getTaskInfoById(@required taskId: number | string): Promise<TaskData> {
    const params = {id: taskId};
    // @ts-ignore
    return {params};
  }

  //根据ID查询画册信息
  @Get("/project/task/person/versionId/:id/:nodeId")
  @validate
  getTaskInfoPersonById(data: number, nodeId: number) {
    const params = {id: data, nodeId: nodeId};
    // @ts-ignore
    const callback = function (res: object) {
      return safeGet<object>(res, "data");
    }
    // @ts-ignore
    return {data, params};
  }


  /**
   * 根据任务ID查询任务明细
   * @param taskId 任务ID
   */
  @tryError([])
  @Gql("graphql")
  @validate
  getTaskFiles(@required taskId: number | string): Promise<PageResult<object>> {
    const funName: string = "getProjectVersionImagesList";
    const data = `{
      ${funName} (input: { taskId: ${taskId}, pageNum:1, pageSize: 1000 }) {
        code
        rows
        msg
      }
    }`;
    const callback = function (res: object) {
      const value = safeGet<object>(res, funName);
      if (value) {
        return new PageResult(value as any);
      }
      return new PageResult<object>();
    };
    // @ts-ignore
    return {data, callback}
  }

  //根据ID查询画册信息
  @tryError({})
  @Get("/project/methods/versionId/:id")
  @validate
  getTaskInfoNodeById(@required id: number | string): Promise<object> {
    const params = {id: id};

    // @ts-ignore
    return {params};
  }
}