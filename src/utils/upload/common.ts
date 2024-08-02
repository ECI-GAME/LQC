import URL from "url";
import * as _ from "lodash-es";
import type {Result} from "@js-lion/upload";

export const Bucket = "eci-assets";

export const Domain = "https://assets.vuejs.com";

export interface FileData {
  fileName: string;
  path?: string;
  src: string;
  size: number;
  name: string;
  type: string;
}

export const format = function (data: Result): FileData {
  const asset = URL.parse(Domain);
  if (data.path && _.includes(data.path, "?")) {
    const temp = URL.parse(data.path);
    asset.pathname = temp.pathname;
  } else if (data.path) {
    asset.pathname = data.path;
  }
  asset.search = `?filename=${encodeURIComponent(data.name)}`;
  return {
    path: data.path,
    size: data.size,
    name: data.name,
    fileName: data.name,
    type: data.type,
    src: URL.format(asset),
  };
}