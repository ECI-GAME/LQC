import {Get, Gql, post, tryError, validate, required} from "@js-lion/api";
import {$error, $success} from "@ue/message"

import {PageResult} from "src/utils/model";
import safeGet from "@fengqiaogang/safe-get";

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
  getTaskInfoById(@required taskId: number | string): Promise<object> {
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
}