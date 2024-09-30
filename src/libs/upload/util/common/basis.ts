/**
 * @file 文件上传
 * @author svon.me@gmail.com
 **/

import {Status} from "./res";
import {uploadStore} from "src/store";

import type {Result} from "./res";
import type {ChangeCallback} from "./config";


let log: any;
export default abstract class {
  public files: File[] = [];                  // 需要上传的文件列表
  public chunkSize: number = 5 * 1024 * 1024; // 切片大小
  public chunkCount: number = 4;              // 同时上传切片数量

  // 记录事件
  public event = new Set<ChangeCallback>();

  protected constructor(files: File[]) {
    this.files = files;
  }

  // 初始化方法
  abstract init(): void | Promise<void>;

  // 绑定回调事件
  on(callback: ChangeCallback) {
    if (callback) {
      this.event.add(callback);
    }
  }

  public onChange(file: File, progress: number = 0, res?: Result) {
    if (!log) {
      log = uploadStore();
    }
    if (log) {
      const reload = () => {
        if (res && res.status === Status.abnormal) {
          return this.putObject(file);
        }
      }
      log.change(file, progress, res, reload);
    }
    for (const callback of this.event) {
      callback(file, Math.min(progress, 100), res);
    }
  }

  // 判断文件属于大文件还是小文件
  abstract isFileSimple(file: File): boolean;

  // 判断文件是否在服务器中存在
  abstract hasObject(file: File, path?: string): Promise<Result | undefined>;

  // 文件上传
  abstract putObject(file: File): Promise<Result>;

  // 开始上传
  async start(): Promise<Result[]> {
    await this.init();
    const list: Result[] = [];
    const abnormal: File[] = [];
    let abnormalAgainCount: number = 3;
    const count = this.files.length;
    const upload = async (files: File[]) => {
      for (let i = 0; i < count; i++) {
        const file = files[i];
        try {
          const res = await this.putObject(file);
          list.push(res);
        } catch (e) {
          console.log(e)
          abnormal.push(file)
        }
      }
      if (abnormal.length > 0) {
        abnormalAgainCount -= 1;
      }
    }
    do {
      await upload(this.files);
    } while (abnormal.length > 0 && abnormalAgainCount > 0);
    return list;
  }

}