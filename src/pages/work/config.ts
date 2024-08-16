import * as _ from "lodash-es";
import * as alias from "src/router/alias";
import {DBList} from "@fengqiaogang/dblist";
import type {ImageData} from "src/types/image";
import safeGet from "@fengqiaogang/safe-get";


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

export const filterSuccess = function (list: ImageData[]): ImageData[] {
  const db = new DBList([]);
  db.insert(list);
  return db.select({isFinish: ["1", 1]});
}