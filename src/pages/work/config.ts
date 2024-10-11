import api from "src/api";
import * as _ from "lodash-es";
import {userStore} from "src/store";
import * as alias from "src/router/alias";
import {DBList} from "@fengqiaogang/dblist";
import safeGet from "@fengqiaogang/safe-get";

import {CheckCode} from "src/types";
import type {Remark} from "src/types";
import type {ImageData} from "src/types/image";
import type {PageResult} from "src/utils/model";
import type {DotData} from "src/components/preview/config";

export enum RecordTabType {
  Word = "文字翻译",
  Comment = "批注"
}

interface CheckWordResut {
  translation: string[][];
  html: string | undefined;
}

export const useCreateBy = function () {
  const user = userStore();
  const isCreateBy = function (data: DotData): boolean {
    const id = safeGet<string>(data, "createBy");
    if (id) {
      const value = user.info.eid;
      return value === id;
    }
    return false;
  }

  return {isCreateBy};
}


/**
 * @file 关键字检查与判断
 */
export const checkWord = async function (project: string | number, keyword?: string): Promise<CheckWordResut> {
  const translation: string[][] = [];
  if (keyword && keyword.length > 0) {
    const res = await api.work.word.check(project, keyword);
    let end: number = 0;
    const result: string[] = [];
    for (const item of res) {
      const code = String(item.checkTypeCode);
      if (code === CheckCode.Disable) {
        const text = keyword.slice(end, item.index - 1);
        result.push(text + `<s>${item.word}</s>`);
        end = item.index + _.size(item.word) - 1;
      } else if (code === CheckCode.Translation) {
        const text = keyword.slice(end, item.index - 1);
        result.push(text + `<span style="color: #0EA5E9;">${item.word}<span>`);
        end = item.index + _.size(item.word) - 1;
        translation.push([item.suggestTranslation, item.word]);
      }
    }
    if (result.length > 0) {
      result.push(keyword.slice(end));
      return {translation, html: result.join("")};
    }
  }
  return {translation, html: void 0};
}
export const changeTranslationList = function (data: string[][], originValue?: object) {
  const map: Map<string, string> = new Map<string, string>(originValue ? Object.entries(originValue) : void 0);
  if (data && data.length > 0) {
    for (const item of data) {
      const [key, value] = item;
      if (!map.has(key)) {
        map.set(key, value || "");
      }
    }
  }
  if (map.size > 0) {
    return Object.fromEntries(map);
  }
  return void 0;
}

export const pickImage = function <T = ImageData>(list: T[], id: string | number): T | undefined {
  return _.find(list, function (item: T) {
    const key = safeGet<string | number>(item, "id")!;
    return String(key) === String(id);
  });
}

export const indexOfImage = function (list: ImageData[], value: ImageData) {
  let index = -1;
  for (let i = 0, size = list.length; i < size; i++) {
    const item = list[i];
    if (String(item.id) === String(value.id)) {
      index = i;
      break;
    }
  }
  return index;
}

export const getPrevRoute = function (list: ImageData[], value: ImageData) {
  const index = indexOfImage(list, value);
  const data = index > 0 ? list[index - 1] : void 0;
  if (data) {
    return {
      name: alias.Work.name,
      params: {
        taskId: data.taskId,
        workId: data.id
      },
    };
  }
}

export const getNextRoute = function (list: ImageData[], value: ImageData) {
  const index = indexOfImage(list, value);
  const data = list[index + 1];
  if (data) {
    return {
      name: alias.Work.name,
      params: {
        taskId: data.taskId,
        workId: data.id
      },
    };
  }
}

export const filterSuccess = function <T = object>(list: T[]): T[] {
  const db = new DBList([]);
  db.insert(list);
  return db.select({isFinish: ["1", 1]});
}

export const typeFieldNames = {
  value: "id",
  label: "errorTypeName",
  children: "childrenList"
};

interface TypeData<T = Remark> {
  db: DBList<T>;
  list: PageResult<T>;
}

export const getTypeList = async function <T = Remark>(projectId: string | number): Promise<TypeData<T>> {
  const res = await api.project.projectErrorType<T>(projectId);
  const db = new DBList([], typeFieldNames.value);
  db.insert(res.results, typeFieldNames.children);
  return {list: res, db};
}