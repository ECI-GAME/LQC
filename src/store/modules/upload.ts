/**
 * @file 用户数据
 * @author svon.me@gmail.com
 */

import {defineStore} from "pinia";
import {Result} from "src/libs/upload/util/upload/res";
import {filePath} from "src/libs/upload/util/upload/config";

interface UploadData extends Result {
  progress: number;

  reload(): Promise<void>;
}

interface Log {
  [key: string]: UploadData;
}

interface State {
  status: number; // 1 隐藏, 2 显示, 0 关闭
  map: Log
}

export type {UploadData};

export const uploadStore = defineStore("upload", {
  state: (): State => {
    return {
      status: 0,
      map: {}
    };
  },
  getters: {
    size(): number {
      const keys: string[] = Object.keys(this.map);
      return keys.length;
    }
  },
  actions: {
    // 文件上传数据跟新
    change: async function (file: File, progress: number, res?: Result, reload?: () => Promise<void>) {
      if (!res || !res.path) {
        const path: string = filePath(file);
        res = new Result(file, path);
      }
      const key: string = res.path!;

      class UploadData extends Result implements UploadData {
        progress: number = 0;

        reload() {
          if (reload) {
            return reload();
          }
        }
      }

      const data = new UploadData(
        file,
        key,
        res.ETag,
        res.status,
      );
      data.progress = progress;

      // @ts-ignore
      const map: Log = {...this.map, [key]: data};
      const status = this.status === 0 ? 2 : this.status;
      this.$patch({status, map});
    },
    hidden() {
      if (this.status !== 0) {
        this.status = 0;
      }
    },
    small() {
      if (this.status !== 1) {
        this.status = 1;
      }
    },
    large() {
      if (this.status !== 2) {
        this.status = 2;
      }
    }
  }
});