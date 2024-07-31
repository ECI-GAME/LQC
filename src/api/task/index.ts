import {Get, Gql, post, tryError, validate} from "@js-lion/api";
import api from "src/api";
import { $error, $success } from "@ue/message"

import {PageResult} from "src/utils/model";
import safeGet from "@fengqiaogang/safe-get";

export default class {
  
  //任务列表查询
  @tryError([])
  @Gql("/graphql")
  async list(pageNum: number,versionId:number, pageSize: number = 20): Promise<PageResult<object>> {
    const data: string = `{
      getProjectTasksList (input: { pageNum: ${pageNum},versionId:${versionId}, pageSize: ${pageSize} }) {
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
  submitTask (data:object) {
    // @ts-ignore
    return {data};
  }

    //根据ID查询版本信息
    @Get("project/task/relations/tasks/:id")
    @validate
    getTaskInfoDetailById ( data: number) {
      const params = { id: data };
      // @ts-ignore
      const callback = function (res: object) {
        return safeGet<object>(res, "data");
      }
      // @ts-ignore
      return {data, params};
    }

        //根据ID查询版本信息
        @Get("project/tasks/:id")
        @validate
        getTaskInfoById ( data: number) {
          const params = { id: data };
          // @ts-ignore
          const callback = function (res: object) {
            return safeGet<object>(res, "data");
          }
          // @ts-ignore
          return {data, params};
        }
}