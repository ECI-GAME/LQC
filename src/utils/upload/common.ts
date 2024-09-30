import URL from "url";
import * as _ from "lodash-es";
import type {Result} from "@js-lion/upload";


export interface FileData {
  fileName: string;
  path?: string;
  src?: string;
  size: number;
  name: string;
  type: string;
}

export const format = function (data: Result): FileData {
  if (data.path) {
    const asset = URL.parse(data.path);
    asset.search = `?filename=${encodeURIComponent(data.name)}`;
    return {
      path: data.path,
      size: data.size,
      name: data.name,
      fileName: data.name,
      type: data.type,
      src: URL.format(asset),
    };
  } else {
    return {
      path: data.path,
      size: data.size,
      name: data.name,
      fileName: data.name,
      type: data.type,
      src: void 0,
    };
  }
}