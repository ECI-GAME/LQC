import * as _ from "lodash-es";
import cache from "src/utils/cache";
import {PageResult} from "src/utils/model";
import safeGet from "@fengqiaogang/safe-get";
import {$error, $success} from "@ue/message"
import {Get, Gql, post, tryError, validate, required, Put} from "@js-lion/api";

import GraphQL from "../graphql";

import type {TaskData} from "src/types/task";

export default class extends GraphQL {
  @tryError(new PageResult())
  @cache(30 * 1000)
  @Get("/project/getMyProjectList")
  projectList(): Promise<PageResult<object>> {
    // @ts-ignore
    return {};
  }

  //任务列表查询
  @tryError(new PageResult())
  async list<T = object>(pageNum: number = 1, versionId: number | string = 0, pageSize: number = 10, query: object = {}): Promise<PageResult<T>> {
    const input = {
      ...query,
      pageNum: Number(pageNum),
      pageSize: Number(pageSize),
      versionId: Number(versionId)
    };
    const apiName = "getProjectTasksList";
    const keys = ["code", "rows", "total", "msg"];
    const value = await this.graphQL<{ rows: T[] }>(apiName, [{input}], keys);

    const res = new PageResult<T>(value);

    const progress = _.map(res.results, (item: object) => {
      const id = safeGet<string | number>(item, "id");
      return this.getTaskProgress(id!);
    });

    const list = await Promise.all(progress);
    const array = _.map(res.results, function (item: object, index: number) {
      const totalCnt = safeGet<number>(list[index], "totalCnt") || 0;  // 总量
      const doneCnt = safeGet<number>(list[index], "doneCnt") || 0;    // 已处理
      const StartCnt = safeGet<number>(list[index], "StartCnt") || 0;   // 未处理
      return {...item, totalCnt, doneCnt, StartCnt};
    })

    return new PageResult<T>(array, res.total);
  }


  //提交任务
  @tryError(false)
  @$error()
  @$success("操作成功")
  @post("/project/tasks/submit")
  @validate
  submitTask(data: object): Promise<boolean> {
    const callback = () => true;
    // @ts-ignore
    return {data, callback};
  }

  //提交任务
  @tryError(false)
  @$error()
  @$success("操作成功")
  @Put("/project/tasks/")
  @validate
  updateTask(@required data: TaskData): Promise<boolean> {
    const callback = () => true;
    // @ts-ignore
    return {data, callback};
  }

  //根据ID查询画册信息
  @tryError({})
  @Get("/project/tasks/taskProgress/:id")
  @validate
  getTaskProgress<T = object>(@required taskId: number | string): Promise<T> {
    const params = {id: taskId};
    // @ts-ignore
    return {params};
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
  @cache(1000 * 3)
  @Get("/project/tasks/:id")
  @validate
  getTaskInfoById(@required projectId: number | string): Promise<TaskData> {
    const params = {id: projectId};
    // @ts-ignore
    return {params};
  }

  //根据版本ID和节点ID获取操作人员列表
  @tryError([])
  @Get("/project/task/person/versionId/:id/:nodeId")
  @validate
  async getTaskInfoPersonById<T = object>(@required versionId: number | string, nodeId?: number | string): Promise<T[]> {
    if (nodeId) {
      const params = {id: versionId, nodeId: nodeId};
      // @ts-ignore
      return {params};
    } else {
      // 获取当前版本下的所有节点
      const nodes = await this.getTaskInfoNodeById(versionId);
      // 默认取第一个节点ID
      const id = safeGet<string | number>(nodes, "[0].id");
      if (id) {
        const params = {id: versionId, nodeId: id};
        // @ts-ignore
        return {params};
      }
    }
    return Promise.reject(new Error("node id 不能为空"));
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
  @tryError([])
  @Get("/project/methods/versionId/:id")
  @validate
  getTaskInfoNodeById<T = object>(@required id: number | string): Promise<T[]> {
    const params = {id: id};
    // @ts-ignore
    return {params};
  }


  //更新图片信息
  @tryError(false)
  @$error()
  @$success("操作成功")
  @post("/project/images/changeImage")
  @validate
  updateImageInfo(data: Array<object>): Promise<boolean> {
    const callback = () => true;
    // @ts-ignore
    return {data, callback};
  }

  /**
   * 根据任务ID查询操作日志记录
   */
  @validate
  async getLogList<T>(@required id: string | number, pageNum: number = 1, pageSize: number = 10): Promise<PageResult<T>> {
    const name: string = "getProjectTaskNodeRecordsList";
    const query = {
      "input": `{ taskId: ${id}, pageNum: ${pageNum}, pageSize: ${pageSize} }`
    };
    const res = await this.graphQL<{ rows: T[], total: number }>(name, [query], ["total", "rows"]);
    if (res) {
      return new PageResult<T>(res);
    }
    return new PageResult<T>();
  }

  @tryError(void 0)
  @$error()
  @cache(1000 * 5)
  @Get("/project/image/relation/file/getComparePicture")
  getImageValue(@required imageId: string | number, @required imageType: string | number): Promise<string | undefined> {
    const params = {id: imageId, type: imageType};
    const callback = (value: object) => {
      const src = safeGet<string>(value, "path");
      if (src) {
        return src;
      }
      return Promise.reject(new Error("预览图片还未生成，请稍后再试。"));
    };
    // @ts-ignore
    return {params, callback};
  }
}